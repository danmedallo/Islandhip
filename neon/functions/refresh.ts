import { parseTriggerInvocation } from '@neon/functions/triggers';

// Render's free instance sleeps after ~15 minutes idle and takes 30–60s to
// wake, so each attempt gets far longer than the refresh itself needs (about a
// second). Three attempts still finish well inside the 15-minute limit a Neon
// Function has to start answering.
const ATTEMPT_TIMEOUT_MS = 120_000;
const ATTEMPTS = 3;
const RETRY_DELAY_MS = 20_000;

// Statuses where the app most likely never ran: Render's proxy giving up on an
// instance that is still starting. Anything else is the app's own answer and is
// reported rather than retried — a 500 means the scrape itself failed.
const RETRYABLE = new Set([502, 503, 504]);

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
    for (let attempt = 1; ; attempt++) {
        const last = attempt === ATTEMPTS;

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

            if (RETRYABLE.has(response.status) && !last) {
                await response.body?.cancel();
                await sleep(RETRY_DELAY_MS);
                continue;
            }

            return {
                // 409 is the app declining a week it has already stored. That is
                // the state the schedule exists to reach, so it is not a failure.
                ok: response.ok || response.status === 409,
                status: response.status,
                attempts: attempt,
                body: await readBody(response),
            };
        } catch (error) {
            // Network failure or the attempt timing out.
            if (!last) {
                await sleep(RETRY_DELAY_MS);
                continue;
            }

            return { ok: false, status: null, attempts: attempt, body: String(error) };
        }
    }
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
