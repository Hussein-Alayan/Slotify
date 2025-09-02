<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BusinessControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_workflow_json_is_generated_on_business_profile_creation()
    {
        $user = User::factory()->create();
        $payload = [
            'name' => 'Workflow Test Business',
            'industry' => 'IT',
            'contact_email' => 'workflow@business.com',
            'contact_phone' => '987654321',
            'address' => '456 Main St',
            'brand_voice' => 'friendly',
            'working_hours' => [
                'mon' => ['09:00', '17:00'],
                'tue' => ['09:00', '17:00'],
                'wed' => ['09:00', '17:00'],
                'thu' => ['09:00', '17:00'],
                'fri' => ['09:00', '17:00'],
                'sat' => [],
                'sun' => [],
            ],
            'services' => [
                [
                    'name' => 'Workflow Service',
                    'duration_minutes' => 30,
                    'price' => 50,
                    'description' => 'Service for workflow test',
                ]
            ],
            'resources' => [
                [
                    'type' => 'staff',
                    'name' => 'Workflow Staff',
                    'availability' => ['mon' => ['09:00', '17:00']],
                ]
            ]
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/business-profile', $payload);
        $response->assertStatus(200);

        $business = \App\Models\Business::where('name', 'Workflow Test Business')->first();
        $this->assertNotNull($business->workflow, 'Workflow JSON should be generated and stored.');

        $workflow = json_decode($business->workflow, true);
        $this->assertIsArray($workflow);
        $this->assertArrayHasKey('business', $workflow);
        $this->assertArrayHasKey('services', $workflow);
        $this->assertArrayHasKey('resources', $workflow);
        $this->assertArrayHasKey('booking_rules', $workflow);
        $this->assertArrayHasKey('communication_channels', $workflow);
        $this->assertArrayHasKey('clients', $workflow);
        $this->assertEquals('Workflow Test Business', $workflow['business']['name']);
    }

    public function test_unauthenticated_user_cannot_access_endpoint()
    {
        $response = $this->postJson('/api/v1/business-profile', []);
        $response->assertStatus(401);
    }

    public function test_validation_errors_for_missing_fields()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/business-profile', []);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'industry', 'contact_email', 'address', 'brand_voice', 'working_hours']);
    }

    public function test_successful_business_profile_creation()
    {
        $user = User::factory()->create();
        $payload = [
            'name' => 'Test Business',
            'industry' => 'IT',
            'contact_email' => 'test@business.com',
            'contact_phone' => '123456789',
            'address' => '123 Main St',
            'brand_voice' => 'formal',
            'working_hours' => [
                'mon' => ['09:00', '17:00'],
                'tue' => ['09:00', '17:00'],
                'wed' => ['09:00', '17:00'],
                'thu' => ['09:00', '17:00'],
                'fri' => ['09:00', '17:00'],
                'sat' => [],
                'sun' => [],
            ],
            'services' => [
                [
                    'name' => 'Consulting',
                    'duration_minutes' => 60,
                    'price' => 100,
                    'description' => 'Business consulting',
                ]
            ],
            'resources' => [
                [
                    'type' => 'staff',
                    'name' => 'John Doe',
                    'availability' => ['mon' => ['09:00', '17:00']],
                ]
            ]
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/business-profile', $payload);
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        $this->assertDatabaseHas('businesses', ['name' => 'Test Business']);
        $this->assertDatabaseHas('services', ['name' => 'Consulting']);
        $this->assertDatabaseHas('resources', ['name' => 'John Doe']);

        $business = \App\Models\Business::where('name', 'Test Business')->first();
        $this->assertDatabaseHas('booking_rules', ['business_id' => $business->id]);
    }

    public function test_transaction_rollback_on_error()
    {
        $user = User::factory()->create();
        $payload = [
            'name' => 'Test Business',
            'industry' => 'IT',
            'contact_email' => 'test@business.com',
            'contact_phone' => '123456789',
            'address' => '123 Main St',
            'brand_voice' => 'formal',
            'working_hours' => [
                'mon' => ['09:00', '17:00'],
                'tue' => ['09:00', '17:00'],
                'wed' => ['09:00', '17:00'],
                'thu' => ['09:00', '17:00'],
                'fri' => ['09:00', '17:00'],
                'sat' => [],
                'sun' => [],
            ],
            'services' => [
                [
                    'name' => 'Consulting',
                    'duration_minutes' => 60,
                    'price' => 100,
                    'description' => 'Business consulting',
                ],
                [
                    'name' => 'Duplicate',
                    'duration_minutes' => null, // This will cause validation error
                    'price' => 100,
                ]
            ],
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/business-profile', $payload);
        $response->assertStatus(422);

        $this->assertDatabaseMissing('businesses', ['name' => 'Test Business']);
        $this->assertDatabaseMissing('services', ['name' => 'Consulting']);
    }
}
