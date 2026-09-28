<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

use function Illuminate\Support\defer;

class CountVisit
{
    // Holds the Manila date this browser was last counted, so a visitor
    // counts once a day however many pages they open.
    private const COOKIE = 'ih_seen';

    private const BOTS = '/bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|curl|wget|python|headless/i';

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $this->isPageView($request, $response)) {
            return $response;
        }

        $today = Carbon::now('Asia/Manila')->toDateString();
        $newVisitor = $request->cookie(self::COOKIE) !== $today;

        if ($newVisitor) {
            Cookie::queue(self::COOKIE, $today, 60 * 48);
        }

        // After the response is sent, so the count never slows a page down,
        // and a database hiccup here is logged instead of failing the page.
        defer(function () use ($today, $newVisitor) {
            try {
                $now = now();

                DB::table('daily_visits')->upsert(
                    [[
                        'visited_on' => $today,
                        'page_views' => 1,
                        'visitors' => (int) $newVisitor,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]],
                    ['visited_on'],
                    [
                        'page_views' => DB::raw('daily_visits.page_views + excluded.page_views'),
                        'visitors' => DB::raw('daily_visits.visitors + excluded.visitors'),
                        'updated_at' => $now,
                    ],
                );
            } catch (Throwable $e) {
                Log::warning('visit counter could not write: '.$e->getMessage());
            }
        });

        return $response;
    }

    private function isPageView(Request $request, Response $response): bool
    {
        if (! $request->isMethod('GET') || $response->getStatusCode() !== 200 || $request->is('up')) {
            return false;
        }

        // Partial reloads and prefetches re-fetch a page the visitor is
        // already on, or may never open.
        if ($request->hasHeader('X-Inertia-Partial-Component') || $request->header('Purpose') === 'prefetch') {
            return false;
        }

        if (preg_match(self::BOTS, (string) $request->userAgent())) {
            return false;
        }

        if ($request->hasHeader('X-Inertia')) {
            return true;
        }

        // A full page load. The service worker warms its page cache with
        // plain fetches at install, which arrive as Sec-Fetch-Mode: cors or
        // same-origin, so only a real navigation counts. Browsers too old to
        // send the header are counted rather than dropped.
        $mode = $request->header('Sec-Fetch-Mode');

        return ($mode === null || $mode === 'navigate')
            && str_contains((string) $response->headers->get('Content-Type'), 'text/html');
    }
}
