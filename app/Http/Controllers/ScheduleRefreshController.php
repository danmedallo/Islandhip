<?php

namespace App\Http\Controllers;

use App\Models\Schedules;
use Carbon\Carbon;
use Carbon\CarbonInterface;
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

        // Refuse work that has already been done. The scrape rebuilds a fixed
        // Sunday-to-Saturday window, so running it twice for the same window
        // just rewrites identical rows.
        //
        // The comparison is against the window the scrape would produce now,
        // not merely "was it run recently" — otherwise a stored week that has
        // rolled into the past would look current and could never be replaced.
        if (! $request->boolean('force')) {
            $stale = $this->alreadyCurrent();

            if ($stale !== null) {
                return response()->json([
                    'ok' => false,
                    'message' => 'Already refreshed for this week.',
                    'window' => $stale['window'],
                    'refreshed_at' => $stale['refreshed_at'],
                ], 409);
            }
        }

        $exitCode = Artisan::call('scrape:schedules');
        $output = trim(Artisan::output());

        return response()->json([
            'ok' => $exitCode === 0,
            'message' => $output,
        ], $exitCode === 0 ? 200 : 500);
    }

    /**
     * Details of the stored week when it already matches the window a refresh
     * would produce, or null when a refresh would actually change something.
     *
     * @return array{window: string, refreshed_at: string}|null
     */
    protected function alreadyCurrent(): ?array
    {
        $start = Carbon::today()->startOfWeek(CarbonInterface::SUNDAY);
        $end = $start->copy()->addDays(6);

        $storedStart = Schedules::min('trip_date');
        $storedEnd = Schedules::max('trip_date');
        $refreshedAt = Schedules::max('updated_at');

        if (! $storedStart || ! $refreshedAt) {
            return null;
        }

        $matchesWindow = Carbon::parse($storedStart)->isSameDay($start)
            && Carbon::parse($storedEnd)->isSameDay($end);

        if (! $matchesWindow) {
            return null;
        }

        // The window matches, so the rows already cover the right days. Only
        // treat it as done if they were written for this window rather than
        // left over from the last time these dates came round.
        if (Carbon::parse($refreshedAt)->lt($start)) {
            return null;
        }

        return [
            'window' => $start->toDateString() . ' .. ' . $end->toDateString(),
            'refreshed_at' => Carbon::parse($refreshedAt)->toIso8601String(),
        ];
    }
}
