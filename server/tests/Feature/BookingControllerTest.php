<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Client;
use App\Models\Service;
use App\Models\Resource;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class BookingControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $business;
    private $client;
    private $service;
    private $resource;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->business = Business::factory()->create(['user_id' => $this->user->id]);
        $this->client = Client::factory()->create(['business_id' => $this->business->id]);
        $this->service = Service::factory()->create(['business_id' => $this->business->id]);
        $this->resource = Resource::factory()->create(['business_id' => $this->business->id]);
        
        // Create booking rules for the business
        \App\Models\BookingRule::factory()->create(['business_id' => $this->business->id]);
    }

    public function test_store_creates_booking_successfully()
    {
        $startTime = Carbon::now()->addDay()->setTime(10, 0, 0);
        $endTime = $startTime->copy()->addHour();

        $payload = [
            'business_id' => $this->business->id,
            'client_id' => $this->client->id,
            'service_id' => $this->service->id,
            'resource_id' => $this->resource->id,
            'start_time' => $startTime->toISOString(),
            'end_time' => $endTime->toISOString(),
        ];

        $response = $this->postJson('/api/v1/bookings', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'business_id',
                    'client_id',
                    'service_id',
                    'resource_id',
                    'start_time',
                    'end_time',
                    'status'
                ]
            ]);

        $this->assertDatabaseHas('bookings', [
            'business_id' => $this->business->id,
            'client_id' => $this->client->id,
            'service_id' => $this->service->id,
            'resource_id' => $this->resource->id,
        ]);
    }

    public function test_store_fails_with_invalid_data()
    {
        $payload = [
            'business_id' => 999, // Non-existent business
            'client_id' => $this->client->id,
            'service_id' => $this->service->id,
            'start_time' => 'invalid-date',
            'end_time' => 'invalid-date',
        ];

        $response = $this->postJson('/api/v1/bookings', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['business_id', 'start_time', 'end_time']);
    }

    public function test_store_fails_when_client_not_belongs_to_business()
    {
        $otherBusiness = Business::factory()->create();
        $otherClient = Client::factory()->create(['business_id' => $otherBusiness->id]);

        $startTime = Carbon::now()->addDay()->setTime(10, 0, 0);
        $endTime = $startTime->copy()->addHour();

        $payload = [
            'business_id' => $this->business->id,
            'client_id' => $otherClient->id, // Client from different business
            'service_id' => $this->service->id,
            'start_time' => $startTime->toISOString(),
            'end_time' => $endTime->toISOString(),
        ];

        $response = $this->postJson('/api/v1/bookings', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['client_id']);
    }

    public function test_store_fails_when_start_time_is_in_past()
    {
        $startTime = Carbon::now()->subHour(); // Past time
        $endTime = $startTime->copy()->addHour();

        $payload = [
            'business_id' => $this->business->id,
            'client_id' => $this->client->id,
            'service_id' => $this->service->id,
            'start_time' => $startTime->toISOString(),
            'end_time' => $endTime->toISOString(),
        ];

        $response = $this->postJson('/api/v1/bookings', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['start_time']);
    }

    public function test_show_returns_booking_details()
    {
        $booking = $this->createBooking();

        $response = $this->getJson("/api/v1/bookings/{$booking->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'business_id',
                    'client_id',
                    'service_id',
                    'resource_id',
                    'start_time',
                    'end_time',
                    'status'
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $booking->id,
                    'business_id' => $this->business->id,
                    'client_id' => $this->client->id,
                ]
            ]);
    }

    public function test_show_fails_for_non_existent_booking()
    {
        $response = $this->getJson('/api/v1/bookings/999');

        $response->assertStatus(404);
    }

    public function test_update_modifies_booking_successfully()
    {
        $booking = $this->createBooking();
        $newStartTime = Carbon::now()->addDays(2)->setTime(14, 0, 0);
        $newEndTime = $newStartTime->copy()->addHour();

        $payload = [
            'start_time' => $newStartTime->toISOString(),
            'end_time' => $newEndTime->toISOString(),
        ];

        $response = $this->putJson("/api/v1/bookings/{$booking->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'start_time',
                    'end_time'
                ]
            ]);

        $booking->refresh();
        $this->assertEquals($newStartTime->format('Y-m-d H:i:s'), $booking->start_time->format('Y-m-d H:i:s'));
    }

    public function test_update_fails_with_invalid_data()
    {
        $booking = $this->createBooking();

        $payload = [
            'start_time' => 'invalid-date',
            'end_time' => Carbon::now()->subHour()->toISOString(), // End time before start time
        ];

        $response = $this->putJson("/api/v1/bookings/{$booking->id}", $payload);

        $response->assertStatus(422);
    }

    public function test_destroy_cancels_booking_successfully()
    {
        $booking = $this->createBooking();

        $response = $this->deleteJson("/api/v1/bookings/{$booking->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'message' => 'Booking cancelled successfully'
                ]
            ]);

        $booking->refresh();
        $this->assertEquals('cancelled', $booking->status);
    }

    public function test_check_availability_returns_available_slots()
    {
        $date = Carbon::now()->addDay()->format('Y-m-d');

        $response = $this->getJson("/api/v1/businesses/{$this->business->id}/availability?date={$date}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'availability'
                ]
            ]);
    }

    public function test_check_availability_with_service_filter()
    {
        $date = Carbon::now()->addDay()->format('Y-m-d');

        $response = $this->getJson("/api/v1/businesses/{$this->business->id}/availability?date={$date}&service_id={$this->service->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'availability'
                ]
            ]);
    }

    public function test_check_availability_fails_with_invalid_date()
    {
        $response = $this->getJson("/api/v1/businesses/{$this->business->id}/availability?date=invalid-date");

        $response->assertStatus(422);
    }

    public function test_check_resource_availability_returns_availability_status()
    {
        $payload = [
            'resource_id' => $this->resource->id,
            'date' => Carbon::now()->addDay()->format('Y-m-d'),
            'time' => '10:00',
            'duration_minutes' => 60
        ];

        $response = $this->getJson('/api/v1/resources/availability?' . http_build_query($payload));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data'
            ]);
    }

    public function test_check_resource_availability_fails_with_invalid_data()
    {
        $payload = [
            'resource_id' => 999, // Non-existent resource
            'date' => 'invalid-date',
            'time' => 'invalid-time',
        ];

        $response = $this->getJson('/api/v1/resources/availability?' . http_build_query($payload));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['resource_id', 'date', 'time']);
    }

    public function test_get_business_bookings_returns_bookings_list()
    {
        $booking1 = $this->createBooking();
        $booking2 = $this->createBooking(['client_id' => Client::factory()->create(['business_id' => $this->business->id])->id]);

        $response = $this->getJson("/api/v1/businesses/{$this->business->id}/bookings");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'business_id',
                        'client_id',
                        'service_id',
                        'start_time',
                        'end_time',
                        'status'
                    ]
                ]
            ]);

        $responseData = $response->json('data');
        $this->assertCount(2, $responseData);
    }

    public function test_get_business_bookings_by_date_filters_correctly()
    {
        $today = Carbon::now();
        $tomorrow = Carbon::now()->addDay();

        // Create booking for today
        $todayBooking = $this->createBooking([
            'start_time' => $today->setTime(10, 0, 0),
            'end_time' => $today->copy()->setTime(11, 0, 0)
        ]);

        // Create booking for tomorrow
        $tomorrowBooking = $this->createBooking([
            'start_time' => $tomorrow->setTime(10, 0, 0),
            'end_time' => $tomorrow->copy()->setTime(11, 0, 0)
        ]);

        $response = $this->getJson("/api/v1/businesses/{$this->business->id}/bookings/by-date?date=" . $today->format('Y-m-d'));

        $response->assertStatus(200);
        
        $responseData = $response->json('data');
        $this->assertCount(1, $responseData);
        $this->assertEquals($todayBooking->id, $responseData[0]['id']);
    }

    public function test_get_client_bookings_returns_client_specific_bookings()
    {
        $booking1 = $this->createBooking();
        $otherClient = Client::factory()->create(['business_id' => $this->business->id]);
        $booking2 = $this->createBooking(['client_id' => $otherClient->id]);

        $response = $this->getJson("/api/v1/clients/{$this->client->id}/bookings");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'client_id',
                        'start_time',
                        'end_time',
                        'status'
                    ]
                ]
            ]);

        $responseData = $response->json('data');
        $this->assertCount(1, $responseData);
        $this->assertEquals($this->client->id, $responseData[0]['client_id']);
    }

    public function test_cancel_client_next_booking_cancels_upcoming_booking()
    {
        // Create future booking
        $futureBooking = $this->createBooking([
            'start_time' => Carbon::now()->addDays(2)->setTime(10, 0, 0),
            'end_time' => Carbon::now()->addDays(2)->setTime(11, 0, 0)
        ]);

        $response = $this->deleteJson("/api/v1/clients/{$this->client->id}/bookings/next");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'message' => 'Next upcoming booking cancelled successfully'
                ]
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'message',
                    'booking' => [
                        'id',
                        'status'
                    ]
                ]
            ]);

        $futureBooking->refresh();
        $this->assertEquals('cancelled', $futureBooking->status);
    }

    public function test_cancel_client_next_booking_fails_when_no_upcoming_bookings()
    {
        // Create past booking
        $pastBooking = $this->createBooking([
            'start_time' => Carbon::now()->subDay()->setTime(10, 0, 0),
            'end_time' => Carbon::now()->subDay()->setTime(11, 0, 0)
        ]);

        $response = $this->deleteJson("/api/v1/clients/{$this->client->id}/bookings/next");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'No upcoming bookings found to cancel'
            ]);
    }

    public function test_business_context_service_is_called_for_resource_availability()
    {
        $mockBusinessContextService = $this->mock(\App\Services\BusinessContextService::class);
        $mockBusinessContextService->shouldReceive('isResourceAvailable')
            ->once()
            ->with($this->resource->id, '2025-09-23', '10:00', 30)
            ->andReturn(true);

        $payload = [
            'resource_id' => $this->resource->id,
            'date' => '2025-09-23',
            'time' => '10:00',
            'duration_minutes' => 30
        ];

        $response = $this->getJson('/api/v1/resources/availability?' . http_build_query($payload));

        $response->assertStatus(200);
    }

    public function test_booking_service_methods_are_called_correctly()
    {
        $mockBookingService = $this->mock(\App\Services\BookingService::class);
        
        // Test store method
        $mockBookingService->shouldReceive('createBooking')
            ->once()
            ->andReturn($this->createBooking());

        $startTime = Carbon::now()->addDay()->setTime(10, 0, 0);
        $endTime = $startTime->copy()->addHour();

        $payload = [
            'business_id' => $this->business->id,
            'client_id' => $this->client->id,
            'service_id' => $this->service->id,
            'start_time' => $startTime->toISOString(),
            'end_time' => $endTime->toISOString(),
        ];

        $response = $this->postJson('/api/v1/bookings', $payload);
        $response->assertStatus(201);
    }

    public function test_error_handling_for_invalid_argument_exception()
    {
        $mockBookingService = $this->mock(\App\Services\BookingService::class);
        $mockBookingService->shouldReceive('createBooking')
            ->once()
            ->andThrow(new \InvalidArgumentException('Resource is not available at this time'));

        $startTime = Carbon::now()->addDay()->setTime(10, 0, 0);
        $endTime = $startTime->copy()->addHour();

        $payload = [
            'business_id' => $this->business->id,
            'client_id' => $this->client->id,
            'service_id' => $this->service->id,
            'start_time' => $startTime->toISOString(),
            'end_time' => $endTime->toISOString(),
        ];

        $response = $this->postJson('/api/v1/bookings', $payload);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Resource is not available at this time'
            ]);
    }

    /**
     * Helper method to create a booking for testing
     */
    private function createBooking(array $overrides = [])
    {
        $defaults = [
            'business_id' => $this->business->id,
            'client_id' => $this->client->id,
            'service_id' => $this->service->id,
            'resource_id' => $this->resource->id,
            'start_time' => Carbon::now()->addDay()->setTime(10, 0, 0),
            'end_time' => Carbon::now()->addDay()->setTime(11, 0, 0),
            'status' => 'confirmed'
        ];

        return Booking::create(array_merge($defaults, $overrides));
    }
}