<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Sunday, not Saturday. The scrape builds the Sunday-to-Saturday window
// containing "today", so a Saturday run rebuilds the week that is ending and
// the new week is never fetched. 01:00 UTC is 09:00 Sunday in Manila — inside
// the new week in both zones.
Schedule::command('scrape:schedules')
    ->sundays()
    ->at('01:00')
    // Backstop for failures the command cannot log itself: a fatal error, the
    // process being killed, or artisan never getting far enough to run.
    ->onFailure(fn () => Log::error('scrape:schedules cron run exited non-zero'))
    ->onSuccess(fn () => Log::info('scrape:schedules cron run completed'));
