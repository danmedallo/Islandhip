<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Browsershot\Browsershot;
use App\Models\Schedules;
use DOMDocument;
use DOMXPath;

class ScrapeSchedules extends Command
{
    protected $signature = 'scrape:schedules';
    protected $description = 'Scrape ferry schedules from Island Shipping';

    public function handle()
    {
        $this->info('🔍 Scraping schedules...');// Wait for JS to render then grab HTML
       $html = Browsershot::url('https://islandshipping.com.ph/schedules')
        ->waitUntilNetworkIdle()
        ->setDelay(3000)
        ->bodyHtml();

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
                $dates[] = $date . ', 2026'; // e.g. "May 17, 2026"
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
                        'trip_date'   => $currentDate
                            ? date('Y-m-d', strtotime($currentDate))
                            : null,
                    ];
                }
            }
            $dayIndex++;
        } 

        //Save to database
        Schedules::truncate(); // wipe all old data first
        foreach ($schedules as $schedule) {
            Schedules::updateOrCreate(
                [
                    'origin'      => $schedule['origin'],
                    'destination' => $schedule['destination'],
                    'time'        => $schedule['time'],
                    'vessel'      => $schedule['vessel'],
                    'trip_date'   => $schedule['trip_date']
                ],
                $schedule
            );
        }

        $this->info('✅ Done! ' . count($schedules) . ' schedules scraped and saved.');
    }
}