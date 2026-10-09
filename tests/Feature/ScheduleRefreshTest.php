<?php

namespace Tests\Feature;

use App\Models\Schedules;
use App\Support\ScheduleWindow;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScheduleRefreshTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['scraper.refresh_token' => 'secret']);
    }

    public function test_refresh_is_disabled_without_a_configured_token(): void
    {
        config(['scraper.refresh_token' => null]);

        $this->postJson('/api/schedules/refresh', [], ['Authorization' => 'Bearer secret'])
            ->assertStatus(503);
    }

    public function test_a_wrong_bearer_token_is_rejected(): void
    {
        $this->postJson('/api/schedules/refresh', [], ['Authorization' => 'Bearer wrong'])
            ->assertUnauthorized();
    }

    public function test_a_token_in_the_query_string_is_rejected(): void
    {
        $this->getJson('/api/schedules/refresh?token=secret')
            ->assertUnauthorized();
    }

    public function test_a_valid_token_declines_a_week_that_is_already_stored(): void
    {
        foreach ([ScheduleWindow::start(), ScheduleWindow::end()] as $day) {
            Schedules::create([
                'origin' => 'Origin',
                'destination' => 'Destination',
                'time' => '08:00',
                'vessel' => 'Vessel',
                'duration' => '60',
                'trip_date' => $day->toDateString(),
            ]);
        }

        $this->postJson('/api/schedules/refresh', [], ['Authorization' => 'Bearer secret'])
            ->assertStatus(409)
            ->assertJson(['ok' => false, 'window' => ScheduleWindow::label()]);
    }
}
