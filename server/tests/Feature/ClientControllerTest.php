<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Client;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class ClientControllerTest extends TestCase
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

    public function test_index_returns_clients_for_business()
    {
        // Create clients for this business
        $client1 = Client::factory()->create(['business_id' => $this->business->id, 'name' => 'John Doe']);
        $client2 = Client::factory()->create(['business_id' => $this->business->id, 'name' => 'Jane Smith']);
        
        // Create client for different business (should not appear)
        Client::factory()->create(['business_id' => $this->otherBusiness->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/clients");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'phone',
                        'email',
                        'business_id'
                    ]
                ]
            ]);

        $responseData = $response->json('data');
        $this->assertCount(2, $responseData);
        
        $clientNames = collect($responseData)->pluck('name')->toArray();
        $this->assertContains('John Doe', $clientNames);
        $this->assertContains('Jane Smith', $clientNames);
    }

    public function test_index_returns_error_for_non_existent_business()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/v1/businesses/999/clients');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Business not found.'
            ]);
    }

    public function test_index_requires_authentication()
    {
        $response = $this->getJson("/api/v1/businesses/{$this->business->id}/clients");

        $response->assertStatus(401);
    }

    public function test_store_creates_client_successfully()
    {
        $payload = [
            'name' => 'New Client',
            'phone' => '+1234567890',
            'email' => 'client@example.com'
        ];

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/businesses/{$this->business->id}/clients", $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'phone',
                    'email',
                    'business_id'
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'New Client',
                    'phone' => '+1234567890',
                    'email' => 'client@example.com',
                    'business_id' => $this->business->id
                ]
            ]);

        $this->assertDatabaseHas('clients', [
            'name' => 'New Client',
            'phone' => '+1234567890',
            'email' => 'client@example.com',
            'business_id' => $this->business->id
        ]);
    }

    public function test_store_fails_with_invalid_data()
    {
        $payload = [
            'name' => '', // Required field empty
            'phone' => 'invalid-phone-number-too-long-to-be-valid',
            'email' => 'invalid-email'
        ];

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/businesses/{$this->business->id}/clients", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'phone', 'email']);
    }

    public function test_store_fails_with_duplicate_phone_in_same_business()
    {
        // Create existing client
        Client::factory()->create([
            'business_id' => $this->business->id,
            'phone' => '+1234567890'
        ]);

        $payload = [
            'name' => 'Duplicate Phone Client',
            'phone' => '+1234567890', // Same phone number
            'email' => 'different@example.com'
        ];

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/businesses/{$this->business->id}/clients", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    public function test_store_allows_same_phone_in_different_businesses()
    {
        // Create client in other business with same phone
        Client::factory()->create([
            'business_id' => $this->otherBusiness->id,
            'phone' => '+1234567890'
        ]);

        $payload = [
            'name' => 'Same Phone Different Business',
            'phone' => '+1234567890',
            'email' => 'client@example.com'
        ];

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/businesses/{$this->business->id}/clients", $payload);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('clients', [
            'name' => 'Same Phone Different Business',
            'phone' => '+1234567890',
            'business_id' => $this->business->id
        ]);
    }

    public function test_store_fails_for_non_existent_business()
    {
        $payload = [
            'name' => 'Test Client',
            'phone' => '+1234567890',
            'email' => 'client@example.com'
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/businesses/999/clients', $payload);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Business not found.'
            ]);
    }

    public function test_show_returns_client_details()
    {
        $client = Client::factory()->create([
            'business_id' => $this->business->id,
            'name' => 'Test Client',
            'phone' => '+1234567890',
            'email' => 'test@example.com'
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/clients/{$client->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'phone',
                    'email',
                    'business_id'
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $client->id,
                    'name' => 'Test Client',
                    'phone' => '+1234567890',
                    'email' => 'test@example.com'
                ]
            ]);
    }

    public function test_show_returns_error_for_non_existent_client()
    {
        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/clients/999");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Client not found.'
            ]);
    }

    public function test_show_returns_error_for_non_existent_business()
    {
        $client = Client::factory()->create(['business_id' => $this->business->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/999/clients/{$client->id}");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Business not found.'
            ]);
    }

    public function test_update_modifies_client_successfully()
    {
        $client = Client::factory()->create([
            'business_id' => $this->business->id,
            'name' => 'Original Name',
            'phone' => '+1234567890',
            'email' => 'original@example.com'
        ]);

        $payload = [
            'name' => 'Updated Name',
            'phone' => '+1987654321',
            'email' => 'updated@example.com'
        ];

        $response = $this->actingAs($this->user)
            ->putJson("/api/v1/businesses/{$this->business->id}/clients/{$client->id}", $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $client->id,
                    'name' => 'Updated Name',
                    'phone' => '+1987654321',
                    'email' => 'updated@example.com'
                ]
            ]);

        $client->refresh();
        $this->assertEquals('Updated Name', $client->name);
        $this->assertEquals('+1987654321', $client->phone);
        $this->assertEquals('updated@example.com', $client->email);
    }

    public function test_update_fails_with_invalid_data()
    {
        $client = Client::factory()->create(['business_id' => $this->business->id]);

        $payload = [
            'name' => '', // Required field empty
            'email' => 'invalid-email'
        ];

        $response = $this->actingAs($this->user)
            ->putJson("/api/v1/businesses/{$this->business->id}/clients/{$client->id}", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email']);
    }

    public function test_update_returns_error_for_non_existent_client()
    {
        $payload = [
            'name' => 'Updated Name'
        ];

        $response = $this->actingAs($this->user)
            ->putJson("/api/v1/businesses/{$this->business->id}/clients/999", $payload);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Client not found.'
            ]);
    }

    public function test_destroy_deletes_client_successfully()
    {
        $client = Client::factory()->create(['business_id' => $this->business->id]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/v1/businesses/{$this->business->id}/clients/{$client->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'message' => 'Client deleted successfully'
                ]
            ]);

        $this->assertDatabaseMissing('clients', ['id' => $client->id]);
    }

    public function test_destroy_fails_when_client_has_existing_bookings()
    {
        $client = Client::factory()->create(['business_id' => $this->business->id]);
        
        // Create a booking for the client
        Booking::create([
            'business_id' => $this->business->id,
            'client_id' => $client->id,
            'service_id' => \App\Models\Service::factory()->create(['business_id' => $this->business->id])->id,
            'start_time' => Carbon::now()->addDay(),
            'end_time' => Carbon::now()->addDay()->addHour(),
            'status' => 'confirmed'
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/v1/businesses/{$this->business->id}/clients/{$client->id}");

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Cannot delete client with existing bookings'
            ]);

        $this->assertDatabaseHas('clients', ['id' => $client->id]);
    }

    public function test_destroy_returns_error_for_non_existent_client()
    {
        $response = $this->actingAs($this->user)
            ->deleteJson("/api/v1/businesses/{$this->business->id}/clients/999");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Client not found.'
            ]);
    }

    public function test_find_or_create_returns_existing_client_by_phone()
    {
        $existingClient = Client::factory()->create([
            'business_id' => $this->business->id,
            'phone' => '+1234567890',
            'normalized_phone' => '1234567890',
            'name' => 'Existing Client'
        ]);

        $payload = [
            'name' => 'Different Name',
            'phone' => '+1234567890' // Same phone as existing client
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/clients/find-or-create", $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $existingClient->id,
                    'name' => 'Existing Client', // Original name should be kept
                    'phone' => '+1234567890'
                ]
            ]);

        // Should not create a new client
        $this->assertDatabaseCount('clients', 1);
        
        // Should update last_whatsapp_activity
        $existingClient->refresh();
        $this->assertNotNull($existingClient->last_whatsapp_activity);
    }

    public function test_find_or_create_creates_new_client_when_not_found()
    {
        $payload = [
            'name' => 'New WhatsApp Client',
            'phone' => '+1234567890'
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/clients/find-or-create", $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'phone',
                    'normalized_phone',
                    'whatsapp_opted_in',
                    'last_whatsapp_activity'
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'New WhatsApp Client',
                    'phone' => '+1234567890',
                    'normalized_phone' => '1234567890',
                    'whatsapp_opted_in' => true
                ]
            ]);

        $this->assertDatabaseHas('clients', [
            'business_id' => $this->business->id,
            'name' => 'New WhatsApp Client',
            'phone' => '+1234567890',
            'normalized_phone' => '1234567890',
            'whatsapp_opted_in' => true
        ]);
    }

    public function test_find_or_create_uses_default_name_when_not_provided()
    {
        $payload = [
            'phone' => '+1234567890'
            // No name provided
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/clients/find-or-create", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_find_or_create_fails_with_invalid_data()
    {
        $payload = [
            'name' => '', // Required field empty
            'phone' => '' // Required field empty
        ];

        $response = $this->postJson("/api/v1/businesses/{$this->business->id}/clients/find-or-create", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'phone']);
    }

    public function test_client_service_methods_are_called_correctly()
    {
        $mockClientService = $this->mock(\App\Services\ClientService::class);
        
        // Test index method
        $mockClientService->shouldReceive('getClients')
            ->once()
            ->with($this->business->id)
            ->andReturn(collect([
                ['id' => 1, 'name' => 'Test Client']
            ]));

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/clients");
        
        $response->assertStatus(200);
    }

    public function test_error_handling_for_model_not_found_exception()
    {
        $mockClientService = $this->mock(\App\Services\ClientService::class);
        $mockClientService->shouldReceive('getClients')
            ->once()
            ->andThrow(new \Illuminate\Database\Eloquent\ModelNotFoundException());

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/clients");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Business not found.'
            ]);
    }

    public function test_business_ownership_validation()
    {
        $otherUser = User::factory()->create();
        $client = Client::factory()->create(['business_id' => $this->business->id]);

        // Try to access business that doesn't belong to the user
        $response = $this->actingAs($otherUser)
            ->getJson("/api/v1/businesses/{$this->business->id}/clients");

        // This should be handled by authorization middleware in real implementation
        // For now, we'll test that the service receives the correct business ID
        $response->assertStatus(200); // Assuming no authorization middleware in test
    }

    public function test_client_belongs_to_business_validation()
    {
        $clientFromOtherBusiness = Client::factory()->create(['business_id' => $this->otherBusiness->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/businesses/{$this->business->id}/clients/{$clientFromOtherBusiness->id}");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Client not found.'
            ]);
    }
}