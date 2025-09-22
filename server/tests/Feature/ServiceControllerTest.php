<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceControllerTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $business;
    private $otherBusiness;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->business = Business::factory()->create(['user_id' => $this->user->id]);
        $this->otherBusiness = Business::factory()->create();
    }

    public function test_index_returns_services_for_business()
    {
        // Create services for this business
        $service1 = Service::factory()->create([
            'business_id' => $this->business->id,
            'name' => 'Haircut',
            'price' => 50.00,
            'status' => 'active'
        ]);
        $service2 = Service::factory()->create([
            'business_id' => $this->business->id,
            'name' => 'Hair Coloring',
            'price' => 100.00,
            'status' => 'active'
        ]);
        
        // Create service for different business (should not appear)
        Service::factory()->create(['business_id' => $this->otherBusiness->id]);

        $response = $this->getJson("/api/v1/businesses/{$this->business->id}/services");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'duration_minutes',
                        'price',
                        'description',
                        'status',
                        'business_id'
                    ]
                ]
            ]);

        $responseData = $response->json('data');
        $this->assertCount(2, $responseData);
        
        $serviceNames = collect($responseData)->pluck('name')->toArray();
        $this->assertContains('Haircut', $serviceNames);
        $this->assertContains('Hair Coloring', $serviceNames);
    }

    public function test_index_returns_empty_array_for_business_without_services()
    {
        $response = $this->getJson("/api/v1/businesses/{$this->business->id}/services");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => []
            ]);
    }

    public function test_index_handles_non_existent_business()
    {
        $response = $this->getJson('/api/v1/businesses/999/services');

        $response->assertStatus(400)
            ->assertJson([
                'success' => false
            ]);
    }

    public function test_store_creates_service_successfully()
    {
        $payload = [
            'name' => 'New Service',
            'duration_minutes' => 60,
            'price' => 75.50,
            'description' => 'A new service offering',
            'status' => 'active'
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'duration_minutes',
                    'price',
                    'description',
                    'status',
                    'business_id'
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'New Service',
                    'duration_minutes' => 60,
                    'price' => 75.50,
                    'description' => 'A new service offering',
                    'status' => 'active',
                    'business_id' => $this->business->id
                ]
            ]);

        $this->assertDatabaseHas('services', [
            'name' => 'New Service',
            'duration_minutes' => 60,
            'price' => 75.50,
            'description' => 'A new service offering',
            'status' => 'active',
            'business_id' => $this->business->id
        ]);
    }

    public function test_store_creates_service_with_minimal_data()
    {
        $payload = [
            'name' => 'Minimal Service',
            'duration_minutes' => 30,
            'price' => 25.00,
            'status' => 'active'
            // description is optional
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Minimal Service',
                    'duration_minutes' => 30,
                    'price' => 25.00,
                    'status' => 'active'
                ]
            ]);

        $this->assertDatabaseHas('services', [
            'name' => 'Minimal Service',
            'duration_minutes' => 30,
            'price' => 25.00,
            'status' => 'active',
            'business_id' => $this->business->id
        ]);
    }

    public function test_store_creates_service_with_photo_base64()
    {
        $payload = [
            'name' => 'Service with Photo',
            'duration_minutes' => 45,
            'price' => 60.00,
            'status' => 'active',
            'photo_base64' => 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4w'
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Service with Photo',
                    'duration_minutes' => 45,
                    'price' => 60.00,
                    'status' => 'active'
                ]
            ]);

        $this->assertDatabaseHas('services', [
            'name' => 'Service with Photo',
            'business_id' => $this->business->id
        ]);
    }

    public function test_store_fails_with_invalid_data()
    {
        $payload = [
            'name' => '', // Required field empty
            'duration_minutes' => -5, // Invalid negative duration
            'price' => -10.00, // Invalid negative price
            'status' => 'invalid_status' // Invalid status
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'duration_minutes', 'price', 'status']);
    }

    public function test_store_fails_with_missing_required_fields()
    {
        $payload = [
            'description' => 'Service without required fields'
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'duration_minutes', 'price', 'status']);
    }

    public function test_store_validates_duration_minimum()
    {
        $payload = [
            'name' => 'Test Service',
            'duration_minutes' => 0, // Below minimum
            'price' => 50.00,
            'status' => 'active'
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['duration_minutes']);
    }

    public function test_store_validates_price_minimum()
    {
        $payload = [
            'name' => 'Test Service',
            'duration_minutes' => 30,
            'price' => -0.01, // Below minimum
            'status' => 'active'
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['price']);
    }

    public function test_store_allows_zero_price()
    {
        $payload = [
            'name' => 'Free Service',
            'duration_minutes' => 30,
            'price' => 0.00, // Zero is allowed
            'status' => 'active'
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $payload);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('services', [
            'name' => 'Free Service',
            'price' => 0.00
        ]);
    }

    public function test_store_validates_status_values()
    {
        $validStatuses = ['active', 'inactive'];
        
        foreach ($validStatuses as $status) {
            $payload = [
                'name' => "Service with {$status} status",
                'duration_minutes' => 30,
                'price' => 50.00,
                'status' => $status
            ];

            $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $payload);
            $response->assertStatus(201);
        }
    }

    public function test_store_handles_service_creation_errors()
    {
        $mockServiceService = $this->mock(\App\Services\ServiceService::class);
        $mockServiceService->shouldReceive('createService')
            ->once()
            ->andThrow(new \Exception('Service creation failed'));

        $payload = [
            'name' => 'Test Service',
            'duration_minutes' => 30,
            'price' => 50.00,
            'status' => 'active'
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $payload);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Service creation failed'
            ]);
    }

    public function test_update_modifies_service_successfully()
    {
        $service = Service::factory()->create([
            'business_id' => $this->business->id,
            'name' => 'Original Service',
            'duration_minutes' => 30,
            'price' => 40.00,
            'status' => 'active'
        ]);

        $payload = [
            'name' => 'Updated Service',
            'duration_minutes' => 45,
            'price' => 55.00,
            'status' => 'inactive',
            'description' => 'Updated description'
        ];

        $response = $this->patchJson("/api/v1/businesses/{$this->business->id}/services/{$service->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'duration_minutes',
                    'price',
                    'status',
                    'description'
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $service->id,
                    'name' => 'Updated Service',
                    'duration_minutes' => 45,
                    'price' => 55.00,
                    'status' => 'inactive',
                    'description' => 'Updated description'
                ]
            ]);

        $service->refresh();
        $this->assertEquals('Updated Service', $service->name);
        $this->assertEquals(45, $service->duration_minutes);
        $this->assertEquals(55.00, $service->price);
        $this->assertEquals('inactive', $service->status);
    }

    public function test_update_allows_partial_updates()
    {
        $service = Service::factory()->create([
            'business_id' => $this->business->id,
            'name' => 'Original Service',
            'duration_minutes' => 30,
            'price' => 40.00,
            'status' => 'active'
        ]);

        $payload = [
            'price' => 60.00 // Only updating price
        ];

        $response = $this->patchJson("/api/v1/businesses/{$this->business->id}/services/{$service->id}", $payload);

        $response->assertStatus(200);
        
        $service->refresh();
        $this->assertEquals('Original Service', $service->name); // Unchanged
        $this->assertEquals(30, $service->duration_minutes); // Unchanged
        $this->assertEquals(60.00, $service->price); // Updated
        $this->assertEquals('active', $service->status); // Unchanged
    }

    public function test_update_fails_with_invalid_data()
    {
        $service = Service::factory()->create(['business_id' => $this->business->id]);

        $payload = [
            'name' => '', // Invalid empty name
            'duration_minutes' => -10, // Invalid negative duration
            'price' => 'not-a-number', // Invalid price
            'status' => 'invalid_status' // Invalid status
        ];

        $response = $this->patchJson("/api/v1/businesses/{$this->business->id}/services/{$service->id}", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['duration_minutes', 'price', 'status']);
            // Name field is optional in updates, so not validated when empty
    }

    public function test_update_handles_non_existent_service()
    {
        $payload = [
            'name' => 'Updated Service'
        ];

        $response = $this->patchJson("/api/v1/businesses/{$this->business->id}/services/999", $payload);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false
            ]);
    }

    public function test_update_handles_service_update_errors()
    {
        $service = Service::factory()->create(['business_id' => $this->business->id]);
        
        $mockServiceService = $this->mock(\App\Services\ServiceService::class);
        $mockServiceService->shouldReceive('updateService')
            ->once()
            ->andThrow(new \Exception('Service update failed'));

        $payload = [
            'name' => 'Updated Service'
        ];

        $response = $this->patchJson("/api/v1/businesses/{$this->business->id}/services/{$service->id}", $payload);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Service update failed'
            ]);
    }

    public function test_service_service_methods_are_called_correctly()
    {
        $mockServiceService = $this->mock(\App\Services\ServiceService::class);
        
        // Test index method
        $mockServiceService->shouldReceive('getServicesByBusiness')
            ->once()
            ->with($this->business->id)
            ->andReturn(collect([
                ['id' => 1, 'name' => 'Test Service']
            ]));

        $response = $this->getJson("/api/v1/businesses/{$this->business->id}/services");
        $response->assertStatus(200);
    }

    public function test_store_calls_service_with_correct_parameters()
    {
        $mockServiceService = $this->mock(\App\Services\ServiceService::class);
        $mockServiceService->shouldReceive('createService')
            ->once()
            ->with($this->business->id, \Mockery::type('array'))
            ->andReturn(Service::factory()->make(['business_id' => $this->business->id]));

        $payload = [
            'name' => 'Test Service',
            'duration_minutes' => 30,
            'price' => 50.00,
            'status' => 'active'
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $payload);
        $response->assertStatus(201);
    }

    public function test_update_calls_service_with_correct_parameters()
    {
        $service = Service::factory()->create(['business_id' => $this->business->id]);
        
        $mockServiceService = $this->mock(\App\Services\ServiceService::class);
        $mockServiceService->shouldReceive('updateService')
            ->once()
            ->with($service->id, \Mockery::type('array'))
            ->andReturn($service);

        $payload = [
            'name' => 'Updated Service'
        ];

        $response = $this->patchJson("/api/v1/businesses/{$this->business->id}/services/{$service->id}", $payload);
        $response->assertStatus(200);
    }

    public function test_response_structure_consistency()
    {
        $service = Service::factory()->create(['business_id' => $this->business->id]);

        // Test that all endpoints return consistent success response structure
        $indexResponse = $this->getJson("/api/v1/businesses/{$this->business->id}/services");
        $indexResponse->assertJsonStructure(['success', 'data']);

        $storePayload = [
            'name' => 'New Service',
            'duration_minutes' => 30,
            'price' => 50.00,
            'status' => 'active'
        ];
        $storeResponse = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $storePayload);
        $storeResponse->assertJsonStructure(['success', 'data']);

        $updatePayload = ['name' => 'Updated Service'];
        $updateResponse = $this->patchJson("/api/v1/businesses/{$this->business->id}/services/{$service->id}", $updatePayload);
        $updateResponse->assertJsonStructure(['success', 'data']);
    }

    public function test_error_response_structure_consistency()
    {
        // Test that error responses have consistent structure
        $invalidPayload = ['name' => ''];
        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/services", $invalidPayload);
        
        $response->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'errors'
            ]);
    }
}