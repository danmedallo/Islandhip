<?php

namespace App\Support;

use App\Models\Schedules;
use Illuminate\Support\Facades\DB;

class ScheduleImporter
{
    /**
     * Replace the stored week in one transaction, so a mid-write failure rolls
     * back to the previous schedule rather than leaving a half-filled table.
     *
     * @param  array<int, array<string, mixed>>  $schedules
     * @return int  rows stored
     */
    public function replace(array $schedules): int
    {
        $rows = $this->deduplicate($schedules);
        $now = now();

        foreach ($rows as $i => $row) {
            $rows[$i] = $row + ['created_at' => $now, 'updated_at' => $now];
        }

        return DB::transaction(function () use ($rows) {
            // delete(), not truncate(): TRUNCATE is DDL and forces an implicit
            // commit on MySQL, which would defeat the rollback.
            Schedules::query()->delete();

            // Bulk insert rather than a save() per row. The table is emptied
            // first, so every row is a plain insert anyway, and one statement
            // per chunk keeps this fast over a remote database — a row-at-a-time
            // loop took over a minute against Neon.
            foreach (array_chunk($rows, 250) as $chunk) {
                Schedules::insert($chunk);
            }

            return count($rows);
        });
    }

    /**
     * The source can list the same sailing more than once; the old row-by-row
     * write collapsed those silently, so keep doing it explicitly.
     *
     * @param  array<int, array<string, mixed>>  $schedules
     * @return array<int, array<string, mixed>>
     */
    protected function deduplicate(array $schedules): array
    {
        $seen = [];

        foreach ($schedules as $schedule) {
            $key = implode('|', [
                $schedule['origin'],
                $schedule['destination'],
                $schedule['time'],
                $schedule['vessel'],
                $schedule['trip_date'] ?? '',
            ]);

            $seen[$key] ??= $schedule;
        }

        return array_values($seen);
    }
}
