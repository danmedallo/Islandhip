<?php

namespace App\Console\Commands;

use App\Support\ScheduleImporter;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Spatie\Browsershot\Browsershot;
use DOMDocument;
use DOMXPath;
use Throwable;

class ScrapeSchedules extends Command
{
    protected $signature = 'scrape:schedules';
    protected $description = 'Scrape ferry schedules from Island Shipping';

    protected const SOURCE_URL = 'https://islandshipping.com.ph/schedules';

    public function handle(): int
    {
        $this->info('🔍 Scraping schedules...');

        try {
            // Wait for JS to render then grab HTML
            $html = Browsershot::url(self::SOURCE_URL)
                ->waitUntilNetworkIdle()
                ->setDelay(3000)
                ->bodyHtml();
        } catch (Throwable $e) {
            return $this->reportFailure('could not fetch the schedule page', $e);
        }

        try {
            $schedules = $this->parseSchedules($html);
        } catch (Throwable $e) {
            return $this->reportFailure('could not parse the schedule page', $e);
        }

        // A successful fetch that yields nothing means the source markup moved
        // out from under our selectors. Stop before the truncate below, or a
        // silent parse failure would wipe the table and leave the app empty.
        if ($schedules === []) {
            return $this->reportFailure(
                'fetched the page but parsed 0 schedules - the source markup has probably changed; existing data left untouched'
            );
        }

        try {
            app(ScheduleImporter::class)->replace($schedules);
        } catch (Throwable $e) {
            return $this->reportFailure('could not save the scraped schedules', $e);
        }

        Log::info('scrape:schedules succeeded', [
            'count' => count($schedules),
            'url' => self::SOURCE_URL,
        ]);

        $this->info('✅ Done! ' . count($schedules) . ' schedules scraped and saved.');

        return self::SUCCESS;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function parseSchedules(string $html): array
    {
        // Parse HTML
        $dom = new DOMDocument();
        @$dom->loadHTML($html);
        $xpath = new DOMXPath($dom);

        // Find all schedule buttons
        $buttons = $xpath->query("//button[contains(@class, 'w-full')]");

        $schedules = [];

        $dayHeaders = $xpath->query("//div[contains(@class, 'px-3 py-2 border-b')]");

        $dates = [];
        foreach ($dayHeaders as $header) {
            $dayNode  = $xpath->query(".//p[contains(@class, 'text-xs')]", $header);
            $dateNode = $xpath->query(".//p[contains(@class, 'text-sm')]", $header);

            if ($dayNode->length && $dateNode->length) {
                $day  = trim($dayNode->item(0)->textContent);  // e.g. "Sun"
                $date = trim($dateNode->item(0)->textContent); // e.g. "May 17"
                $dates[] = $this->resolveTripDate($date);
            }
        }

       // Get all day columns
        $dayColumns = $xpath->query("//div[contains(@class, 'p-2 space-y-1.5')]");

        $dayIndex = 0;

        foreach ($dayColumns as $column) {
            $currentDate = $dates[$dayIndex] ?? null;
            $buttons = $xpath->query(".//button[contains(@class, 'w-full text-left')]", $column);

            foreach ($buttons as $button) {
                $routeNode = $xpath->query(".//p[contains(@class, 'text-primary')]", $button);
                $timeNode  = $xpath->query(".//span[contains(@class, 'text-foreground font-medium')]", $button);
                $infoNode  = $xpath->query(".//p[contains(@class, 'text-muted-foreground truncate mt-0.5')]", $button);

                if ($routeNode->length && $timeNode->length && $infoNode->length) {
                    $route  = trim($routeNode->item(0)->textContent);
                    $time   = trim($timeNode->item(0)->textContent);
                    $info   = trim($infoNode->item(0)->textContent);

                    $parts    = explode('·', $info);
                    $vessel   = trim($parts[0] ?? '');
                    $duration = trim($parts[1] ?? '');

                    $routeParts  = explode('→', $route);
                    $origin      = trim($routeParts[0] ?? '');
                    $destination = trim($routeParts[1] ?? '');

                    $schedules[] = [
                        'origin'      => $origin,
                        'destination' => $destination,
                        'time'        => $time,
                        'vessel'      => $vessel,
                        'duration'    => $duration,
                        'trip_date'   => $currentDate,
                    ];
                }
            }
            $dayIndex++;
        }

        return $schedules;
    }


    /**
     * Log loudly and exit non-zero, so a cron run that fails is visible in the
     * log and to the scheduler rather than disappearing into /dev/null.
     */
    protected function reportFailure(string $reason, ?Throwable $e = null): int
    {
        Log::error("scrape:schedules failed: {$reason}", array_filter([
            'url' => self::SOURCE_URL,
            'exception' => $e?->getMessage(),
            'class' => $e ? $e::class : null,
        ]));

        $this->error('❌ Scrape failed: ' . $reason . ($e ? ' - ' . $e->getMessage() : ''));

        return self::FAILURE;
    }

    /**
     * The source page labels each column "May 17" with no year. Pick the year
     * that lands the date nearest today, so a Saturday scrape in late December
     * still dates the following week's January sailings to the next year.
     */
    protected function resolveTripDate(string $label): ?string
    {
        $today = Carbon::today();
        $best = null;

        foreach ([$today->year - 1, $today->year, $today->year + 1] as $year) {
            $date = Carbon::createFromFormat('M j, Y', "{$label}, {$year}");

            if ($date === false) {
                return null;
            }

            $date = $date->startOfDay();

            if ($best === null || abs($date->diffInDays($today)) < abs($best->diffInDays($today))) {
                $best = $date;
            }
        }

        return $best?->toDateString();
    }
}
