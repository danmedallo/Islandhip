<?php

namespace App\Support;

use Carbon\Carbon;
use Carbon\CarbonInterface;

/**
 * The Sunday-to-Saturday span of sailings the app publishes.
 *
 * Both the scrape and the refresh trigger's "already current" check read this,
 * so they cannot disagree about which week is the right one.
 */
class ScheduleWindow
{
    /**
     * Start of the window the app should currently be showing.
     *
     * Anchored to local time, not UTC: the schedule is published for
     * passengers in the Philippines, and a UTC anchor put a Saturday-evening
     * run in the wrong week.
     *
     * A Saturday run prepares the week that begins the next day. Without that,
     * the weekly refresh rebuilds the week that is ending and the new one is
     * never fetched, leaving the app six days behind.
     */
    public static function start(): Carbon
    {
        $anchor = Carbon::now(config('scraper.timezone'))->startOfDay();

        if ($anchor->isSaturday()) {
            $anchor->addDay();
        }

        return $anchor->startOfWeek(CarbonInterface::SUNDAY);
    }

    public static function end(): Carbon
    {
        return static::start()->addDays(6);
    }

    /** @return array<int, Carbon> the seven days, in order */
    public static function days(): array
    {
        $start = static::start();

        return array_map(
            fn (int $offset) => $start->copy()->addDays($offset),
            range(0, 6),
        );
    }

    public static function label(): string
    {
        return static::start()->toDateString() . ' .. ' . static::end()->toDateString();
    }
}
