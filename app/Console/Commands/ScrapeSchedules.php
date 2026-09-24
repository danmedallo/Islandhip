<?php

namespace App\Console\Commands;

use App\Support\ScheduleImporter;
use App\Support\ScheduleWindow;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class ScrapeSchedules extends Command
{
    protected $signature = 'scrape:schedules';
    protected $description = 'Refresh ferry schedules from the Island Shipping timetable API';

    public function handle(): int
    {
        $this->info('🔍 Fetching schedules...');

        try {
            $recurring = $this->fetch();
        } catch (Throwable $e) {
            return $this->reportFailure('could not reach the schedule API', $e);
        }

        if ($recurring === []) {
            return $this->reportFailure(
                'the API returned no active schedules - existing data left untouched'
            );
        }

        $schedules = $this->expandToWeek($recurring);

        // Recurring rows exist but none land in this week: treat that as a
        // failure rather than emptying the table.
        if ($schedules === []) {
            return $this->reportFailure(
                'no sailings fell within the coming week - existing data left untouched'
            );
        }

        try {
            app(ScheduleImporter::class)->replace($schedules);
        } catch (Throwable $e) {
            return $this->reportFailure('could not save the schedules', $e);
        }

        Log::info('scrape:schedules succeeded', [
            'count' => count($schedules),
            'recurring' => count($recurring),
            'window' => ScheduleWindow::label(),
        ]);

        $this->info('✅ Done! ' . count($schedules) . ' schedules saved for ' . ScheduleWindow::label() . '.');

        return self::SUCCESS;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function fetch(): array
    {
        $key = (string) config('scraper.key');

        $response = Http::withHeaders([
            'apikey' => $key,
            'Authorization' => 'Bearer ' . $key,
        ])
            ->acceptJson()
            ->timeout(30)
            ->retry(3, 2000, throw: false)
            ->get(config('scraper.endpoint'), [
                'select' => config('scraper.select'),
                'is_active' => 'eq.true',
            ]);

        if ($response->failed()) {
            throw new \RuntimeException(sprintf(
                'API returned %d: %s',
                $response->status(),
                Str::limit($response->body(), 200)
            ));
        }

        return $response->json() ?? [];
    }

    /**
     * Each API row is a recurring sailing carrying a days_of_week array, so
     * expand it into one dated row per matching day of the current
     * Sunday-Saturday week — the window the source site itself displays.
     *
     * days_of_week uses the JavaScript convention, 0 = Sunday. Verified
     * against the previous HTML scrape: an identical 215 rows for the same
     * week, with zero differences.
     *
     * @param  array<int, array<string, mixed>>  $recurring
     * @return array<int, array<string, mixed>>
     */
    protected function expandToWeek(array $recurring): array
    {
        $schedules = [];

        foreach (ScheduleWindow::days() as $date) {
            $dayOfWeek = (int) $date->format('w'); // 0 = Sunday

            foreach ($recurring as $row) {
                if (! in_array($dayOfWeek, $row['days_of_week'] ?? [], true)) {
                    continue;
                }

                $origin = data_get($row, 'routes.origin_port.name');
                $destination = data_get($row, 'routes.destination_port.name');
                $vessel = data_get($row, 'vessels.name');

                if (! $origin || ! $destination || ! $vessel) {
                    continue;
                }

                $schedules[] = [
                    'origin' => $origin,
                    'destination' => $destination,
                    'time' => $this->formatTime((string) $row['departure_time']),
                    'vessel' => $vessel,
                    'duration' => $this->formatDuration((int) ($row['duration_minutes'] ?? 0)),
                    'trip_date' => $date->toDateString(),
                ];
            }
        }

        return $schedules;
    }

    /** "01:00:00" -> "1:00 AM" */
    protected function formatTime(string $time): string
    {
        return Carbon::createFromFormat('H:i:s', $time)->format('g:i A');
    }

    /** 120 -> "2h", 90 -> "1h 30m" */
    protected function formatDuration(int $minutes): string
    {
        $hours = intdiv($minutes, 60);
        $rest = $minutes % 60;

        return match (true) {
            $hours && $rest => "{$hours}h {$rest}m",
            (bool) $hours => "{$hours}h",
            default => "{$rest}m",
        };
    }

    /**
     * Log loudly and exit non-zero, so a failed run is visible in the log and
     * to the scheduler rather than disappearing into /dev/null.
     */
    protected function reportFailure(string $reason, ?Throwable $e = null): int
    {
        Log::error("scrape:schedules failed: {$reason}", array_filter([
            'endpoint' => config('scraper.endpoint'),
            'exception' => $e?->getMessage(),
            'class' => $e ? $e::class : null,
        ]));

        $this->error('❌ Refresh failed: ' . $reason . ($e ? ' - ' . $e->getMessage() : ''));

        return self::FAILURE;
    }
}
