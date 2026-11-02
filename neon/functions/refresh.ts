import { parseTriggerInvocation } from '@neon/functions/triggers';

// Render's free instance sleeps after ~15 minutes idle and takes 30–60s to
// wake, so each attempt gets far longer than the refresh itself needs (about a
// second).
const ATTEMPT_TIMEOUT_MS = 120_000;
const ATTEMPTS = 5;

// A Neon Function has 15 minutes to answer. No new attempt starts after this
// much time has passed, so even one that runs to its full timeout finishes
// with a minute to spare.
const BUDGET_MS = 12 * 60_000;

// Waits between attempts double from the first delay up to the cap: 30s, 60s,
// 120s, 180s. A Retry-After header replaces the computed wait, within the same
// bounds.
const FIRST_DELAY_MS = 30_000;
const MIN_DELAY_MS = 20_000;
const MAX_DELAY_MS = 180_000;

// Statuses where the app most likely never ran, so another attempt is worth
// making. 502–504 is Render's proxy giving up on an instance that is still
// starting. 429 is a rate limit: on 2026-10-31 Cloudflare, in front of Render,
// answered every attempt with a 429 bot challenge and the week was never
// refreshed. Anything else is the app's own answer and is reported rather than
// retried — a 500 means the scrape itself failed.
const RETRYABLE = new Set([429, 502, 503, 504]);

type Outcome = {
    ok: boolean;
    status: number | null;
    attempts: number;
    body: unknown;
};

/**
 * Weekly refresh, fired by the `weekly-refresh` schedule trigger in neon.ts.
 *
 * The scrape stays in Laravel; this only calls the app's own refresh endpoint,
 * the same request the external cron service used to make.
 */
export default {
    async fetch(request: Request): Promise<Response> {
        // A function URL is public. Neon strips client-supplied X-Neon-* headers
        // at its edge, so only a real trigger delivery passes this check.
        const parsed = await parseTriggerInvocation(request);

        if (!parsed.ok) {
            return new Response(parsed.error, { status: parsed.error === 'invalid_body' ? 400 : 401 });
        }

        const url = process.env.SCHEDULE_REFRESH_URL;
        const token = process.env.SCHEDULE_REFRESH_TOKEN;

        if (!url || !token) {
            console.error('Schedule refresh is not configured: SCHEDULE_REFRESH_URL or SCHEDULE_REFRESH_TOKEN is missing.');

            return new Response('Not configured.', { status: 500 });
        }

        const outcome = await refresh(url, token);

        // One line per run, so `neon logs query --source function` reads as a
        // history of the weekly refresh.
        (outcome.ok ? console.log : console.error)(JSON.stringify({
            invocation: parsed.invocation.invocationId,
            scheduledAt: parsed.invocation.data.scheduledAt,
            ...outcome,
        }));

        return Response.json(outcome, { status: outcome.ok ? 200 : 502 });
    },
};

async function refresh(url: string, token: string): Promise<Outcome> {
    const started = Date.now();

    for (let attempt = 1; ; attempt++) {
        let outcome: Outcome;
        let retryAfter: number | null = null;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Without it Laravel answers errors with an HTML page.
                    Accept: 'application/json',
                },
                signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
            });

            outcome = {
                // 409 is the app declining a week it has already stored. That is
                // the state the schedule exists to reach, so it is not a failure.
                ok: response.ok || response.status === 409,
                status: response.status,
                attempts: attempt,
                body: await readBody(response),
            };

            if (!RETRYABLE.has(response.status)) {
                return outcome;
            }

            retryAfter = parseRetryAfter(response.headers.get('retry-after'));
        } catch (error) {
            // Network failure or the attempt timing out.
            outcome = { ok: false, status: null, attempts: attempt, body: String(error) };
        }

        const delay = clamp(retryAfter ?? FIRST_DELAY_MS * 2 ** (attempt - 1), MIN_DELAY_MS, MAX_DELAY_MS);

        if (attempt === ATTEMPTS || Date.now() - started + delay > BUDGET_MS) {
            return outcome;
        }

        console.warn(JSON.stringify({ attempt, status: outcome.status, retryingInMs: delay }));
        await sleep(delay);
    }
}

/** Retry-After in milliseconds, from either delay-seconds or an HTTP date. */
function parseRetryAfter(value: string | null): number | null {
    if (!value) {
        return null;
    }

    if (/^\d+$/.test(value.trim())) {
        return Number(value.trim()) * 1000;
    }

    const date = Date.parse(value);

    return Number.isNaN(date) ? null : Math.max(0, date - Date.now());
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

async function readBody(response: Response): Promise<unknown> {
    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch {
        return text.slice(0, 500);
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
