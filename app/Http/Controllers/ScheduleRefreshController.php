<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class ScheduleRefreshController extends Controller
{
    /**
     * Refresh trigger for an external cron service. The command it runs is the
     * same one the Laravel scheduler would run; it takes a second or so, so it
     * is safe to answer synchronously.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $expected = (string) config('scraper.refresh_token');

        // Without a configured token every caller would authenticate, so fail
        // closed rather than exposing an open trigger.
        abort_if($expected === '', 503, 'Schedule refresh is not configured.');

        // Header is preferred; the query string is there because some free cron
        // services can only fetch a plain URL.
        $given = (string) ($request->bearerToken() ?: $request->query('token', ''));

        if (! hash_equals($expected, $given)) {
            Log::warning('Rejected schedule refresh with a bad token', [
                'ip' => $request->ip(),
            ]);

            abort(401, 'Invalid refresh token.');
        }

        $exitCode = Artisan::call('scrape:schedules');
        $output = trim(Artisan::output());

        return response()->json([
            'ok' => $exitCode === 0,
            'message' => $output,
        ], $exitCode === 0 ? 200 : 500);
    }
}
