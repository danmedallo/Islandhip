import { defineConfig } from '@neon/config/v1';

// The weekly schedule refresh, run by Neon instead of an external cron service.
// See DEPLOY-RENDER.md#refreshing-the-schedules.
//
// Function env is read from .env when deploying (`npm run deploy` passes it)
// and each deploy snapshots it, so changing a value means deploying again.
export default defineConfig({
    functions: {
        refresh: {
            name: 'Weekly schedule refresh',
            source: './functions/refresh.ts',
            env: {
                SCHEDULE_REFRESH_URL: refreshUrl(),
                SCHEDULE_REFRESH_TOKEN: required('SCHEDULE_REFRESH_TOKEN'),
            },
        },
    },
    triggers: {
        'weekly-refresh': {
            type: 'schedule',
            function: 'refresh',
            // Saturday 21:00 in Manila — the slot routes/console.php uses, and
            // the one ScheduleWindow treats as preparing the coming week.
            // Triggers only take UTC; Manila is UTC+8 with no daylight saving.
            cron: '0 13 * * 6',
        },
    },
});

function required(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is not set. Copy .env.example to .env and fill it in.`);
    }

    return value;
}

// An http:// URL would be redirected to https://, and fetch drops the
// Authorization header when it follows that redirect, so every run would be
// rejected as unauthenticated.
function refreshUrl(): string {
    const url = required('SCHEDULE_REFRESH_URL');

    if (!url.startsWith('https://')) {
        throw new Error('SCHEDULE_REFRESH_URL must be an https:// URL.');
    }

    // A real Render app belonging to someone else, and the placeholder this
    // file's .env.example once shipped. Deploying with it sends them the token
    // on every run.
    if (new URL(url).hostname === 'your-service.onrender.com') {
        throw new Error('SCHEDULE_REFRESH_URL points at your-service.onrender.com, which is not this app. Use this app\'s Render URL.');
    }

    return url;
}
