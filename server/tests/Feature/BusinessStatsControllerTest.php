<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Business;
use App\Models\Service;
use App\Models\Client;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class BusinessStatsControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected Business $business;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->business = Business::factory()->create(['user_id' => $this->user->id]);
    }

    public function test_total_services_returns_correct_count()
    {
        // Create services for the business
        Service::factory()->count(5)->create(['business_id' => $this->business->id]);
        
        // Create services for another business (should not be counted)
        $otherBusiness = Business::factory()->create();
        Service::factory()->count(3)->create(['business_id' => $otherBusiness->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/total-services");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_services'
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_services' => 5
                ]
            ]);
    }

    public function test_total_services_returns_zero_when_no_services()
    {
        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/total-services");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_services' => 0
                ]
            ]);
    }

    public function test_active_services_returns_only_active_count()
    {
        // Create active services
        Service::factory()->count(3)->create([
            'business_id' => $this->business->id,
            'status' => 'active'
        ]);

        // Create inactive services
        Service::factory()->count(2)->create([
            'business_id' => $this->business->id,
            'status' => 'inactive'
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/active-services");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'active_services' => 3
                ]
            ]);
    }

    public function test_active_services_returns_zero_when_no_active_services()
    {
        // Create only inactive services
        Service::factory()->count(2)->create([
            'business_id' => $this->business->id,
            'status' => 'inactive'
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/active-services");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'active_services' => 0
                ]
            ]);
    }

    public function test_total_clients_returns_correct_count()
    {
        // Create clients for the business
        Client::factory()->count(4)->create(['business_id' => $this->business->id]);
        
        // Create clients for another business (should not be counted)
        $otherBusiness = Business::factory()->create();
        Client::factory()->count(2)->create(['business_id' => $otherBusiness->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/total-clients");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_clients' => 4
                ]
            ]);
    }

    public function test_total_clients_returns_zero_when_no_clients()
    {
        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/total-clients");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_clients' => 0
                ]
            ]);
    }

    public function test_total_bookings_returns_correct_count()
    {
        // Create bookings manually since no BookingFactory exists
        $client = Client::factory()->create(['business_id' => $this->business->id]);
        $service = Service::factory()->create(['business_id' => $this->business->id]);

        // Create bookings for the business manually
        for ($i = 0; $i < 6; $i++) {
            \App\Models\Booking::create([
                'business_id' => $this->business->id,
                'client_id' => $client->id,
                'service_id' => $service->id,
                'start_time' => now()->addDays($i)->setTime(10, 0),
                'end_time' => now()->addDays($i)->setTime(11, 0),
                'status' => 'confirmed'
            ]);
        }

        // Create bookings for another business (should not be counted)
        $otherBusiness = Business::factory()->create();
        $otherClient = Client::factory()->create(['business_id' => $otherBusiness->id]);
        $otherService = Service::factory()->create(['business_id' => $otherBusiness->id]);
        
        for ($i = 0; $i < 3; $i++) {
            \App\Models\Booking::create([
                'business_id' => $otherBusiness->id,
                'client_id' => $otherClient->id,
                'service_id' => $otherService->id,
                'start_time' => now()->addDays($i)->setTime(14, 0),
                'end_time' => now()->addDays($i)->setTime(15, 0),
                'status' => 'confirmed'
            ]);
        }

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/total-bookings");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_bookings' => 6
                ]
            ]);
    }

    public function test_total_bookings_returns_zero_when_no_bookings()
    {
        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/total-bookings");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_bookings' => 0
                ]
            ]);
    }

    public function test_unauthorized_user_can_access_business_stats_for_testing()
    {
        // Note: Routes are intentionally public for testing as per api.php comments
        $unauthorizedUser = User::factory()->create();

        $response = $this->actingAs($unauthorizedUser)
            ->getJson("/api/v1/businesses/{$this->business->id}/total-services");

        $response->assertStatus(200);
    }

    public function test_stats_endpoints_work_without_authentication_for_testing()
    {
        // Note: Routes are intentionally public for testing as per api.php comments
        $endpoints = [
            "/api/v1/businesses/{$this->business->id}/total-services",
            "/api/v1/businesses/{$this->business->id}/active-services", 
            "/api/v1/businesses/{$this->business->id}/total-clients",
            "/api/v1/businesses/{$this->business->id}/total-bookings"
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->getJson($endpoint);
            $response->assertStatus(200);
        }
    }

    public function test_stats_endpoints_handle_invalid_business_id()
    {
        $invalidBusinessId = 99999;
        
        $endpoints = [
            "/api/v1/businesses/{$invalidBusinessId}/total-services",
            "/api/v1/businesses/{$invalidBusinessId}/active-services",
            "/api/v1/businesses/{$invalidBusinessId}/total-clients", 
            "/api/v1/businesses/{$invalidBusinessId}/total-bookings"
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->actingAs($this->user)
                ->getJson($endpoint);
            $response->assertStatus(404);
        }
    }

    public function test_stats_endpoints_response_structure_consistency()
    {
        $endpoints = [
            "/api/v1/businesses/{$this->business->id}/total-services" => 'total_services',
            "/api/v1/businesses/{$this->business->id}/active-services" => 'active_services',
            "/api/v1/businesses/{$this->business->id}/total-clients" => 'total_clients',
            "/api/v1/businesses/{$this->business->id}/total-bookings" => 'total_bookings'
        ];

        foreach ($endpoints as $endpoint => $dataKey) {
            $response = $this->actingAs($this->user)
                ->getJson($endpoint);

            $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        $dataKey
                    ]
                ])
                ->assertJson([
                    'success' => true
                ]);
        }
    }

    public function test_stats_endpoints_return_integer_values()
    {
        $endpoints = [
            "/api/v1/businesses/{$this->business->id}/total-services",
            "/api/v1/businesses/{$this->business->id}/active-services",
            "/api/v1/businesses/{$this->business->id}/total-clients",
            "/api/v1/businesses/{$this->business->id}/total-bookings"
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->actingAs($this->user)
                ->getJson($endpoint);

            $response->assertStatus(200);
            $data = $response->json('data');
            $value = array_values($data)[0];
            $this->assertIsInt($value);
            $this->assertGreaterThanOrEqual(0, $value);
        }
    }
}