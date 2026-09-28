<?php

namespace Tests\Feature;

use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CountVisitTest extends TestCase
{
    use RefreshDatabase;

    private const BROWSER = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1';

    protected function setUp(): void
    {
        parent::setUp();

        // Run the deferred write inside the request so assertions can see it.
        $this->withoutDefer();
    }

    private function today(): object|null
    {
        return DB::table('daily_visits')
            ->where('visited_on', Carbon::now('Asia/Manila')->toDateString())
            ->first();
    }

    private function open(string $url, array $headers = [])
    {
        return $this->get($url, $headers + ['User-Agent' => self::BROWSER, 'Sec-Fetch-Mode' => 'navigate']);
    }

    public function test_a_first_visit_counts_a_visitor_and_a_page_view(): void
    {
        $this->open('/')->assertOk()->assertCookie('ih_seen');

        $row = $this->today();
        $this->assertSame(1, (int) $row->page_views);
        $this->assertSame(1, (int) $row->visitors);
    }

    public function test_the_same_visitor_adds_page_views_but_not_visitors(): void
    {
        $this->open('/');
        $this->withCookie('ih_seen', Carbon::now('Asia/Manila')->toDateString())
            ->open('/schedule');

        $row = $this->today();
        $this->assertSame(2, (int) $row->page_views);
        $this->assertSame(1, (int) $row->visitors);
    }

    public function test_a_cookie_from_yesterday_counts_again(): void
    {
        $this->withCookie('ih_seen', Carbon::now('Asia/Manila')->subDay()->toDateString())
            ->open('/');

        $this->assertSame(1, (int) $this->today()->visitors);
    }

    public function test_service_worker_warmups_bots_and_non_pages_are_not_counted(): void
    {
        $this->open('/', ['Sec-Fetch-Mode' => 'same-origin']);
        $this->open('/', ['User-Agent' => 'Googlebot/2.1 (+http://www.google.com/bot.html)']);
        $this->open('/', ['Purpose' => 'prefetch']);
        $this->open('/sw.js');
        $this->open('/missing-page');

        $this->assertNull($this->today());
    }
}
