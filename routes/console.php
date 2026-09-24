<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Saturday evening in Manila, which ScheduleWindow treats as preparing the
// week that starts the next day — see the Saturday rule there. Anchored to
// Asia/Manila rather than UTC, where 21:00 Saturday local is still Saturday
// and would rebuild the week that is ending.
Schedule::command('scrape:schedules')
    ->saturdays()
    ->at('21:00')
    ->timezone('Asia/Manila')
    // Backstop for failures the command cannot log itself: a fatal error, the
    // process being killed, or artisan never getting far enough to run.
    ->onFailure(fn () => Log::error('scrape:schedules cron run exited non-zero'))
    ->onSuccess(fn () => Log::info('scrape:schedules cron run completed'));
