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
        return DB::transaction(function () use ($schedules) {
            // delete(), not truncate(): TRUNCATE is DDL and forces an implicit
            // commit on MySQL, which would defeat the rollback this relies on.
            Schedules::query()->delete();

            foreach ($schedules as $schedule) {
                Schedules::updateOrCreate(
                    [
                        'origin' => $schedule['origin'],
                        'destination' => $schedule['destination'],
                        'time' => $schedule['time'],
                        'vessel' => $schedule['vessel'],
                        'trip_date' => $schedule['trip_date'] ?? null,
                    ],
                    $schedule
                );
            }

            return Schedules::count();
        });
    }
}
