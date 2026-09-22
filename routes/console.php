<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Deliberately UTC: this lands at 05:00 Sunday Manila time, ahead of the
// week's traffic. Needs `* * * * * php artisan schedule:run` on the server.
Schedule::command('scrape:schedules')
    ->saturdays()
    ->at('21:00')
    // Backstop for failures the command cannot log itself: a fatal error, the
    // process being killed, or artisan never getting far enough to run.
    ->onFailure(fn () => Log::error('scrape:schedules cron run exited non-zero'))
    ->onSuccess(fn () => Log::info('scrape:schedules cron run completed'));
