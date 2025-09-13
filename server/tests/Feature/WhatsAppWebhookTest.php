<?php

namespace Tests\Feature;

use App\Models\Business;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WhatsAppWebhookTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_handles_valid_whatsapp_webhook()
    {
        $business = Business::factory()->create([
            'contact_phone' => '+1234567890'
        ]);

        $payload = [
            'provider' => 'twilio',
            'to_phone' => '+1234567890',
            'from_phone' => '+0987654321',
            'from_name' => 'Test User',
            'message_content' => 'Hello, I want to book an appointment',
            'external_message_id' => 'msg_123'
        ];

        $response = $this->postJson('/api/v1/webhooks/whatsapp', $payload);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'business',
                        'client',
                        'conversation',
                        'message',
                        'processed_at'
                    ]
                ]);
    }

    /** @test */
    public function it_returns_health_check()
    {
        $response = $this->getJson('/api/v1/webhooks/whatsapp/health');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'status' => 'healthy',
                        'service' => 'whatsapp-webhook'
                    ]
                ]);
    }

    /** @test */
    public function it_handles_invalid_webhook_signature()
    {
        $payload = [
            'provider' => 'invalid_provider',
            'to_phone' => '+1234567890',
            'from_phone' => '+0987654321',
            'message_content' => 'Test message'
        ];

        $response = $this->postJson('/api/v1/webhooks/whatsapp', $payload);

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'message' => 'Invalid signature'
                ]);
    }

    /** @test */
    public function it_handles_unknown_business()
    {
        $payload = [
            'provider' => 'twilio',
            'to_phone' => '+19999999999', // Non-existent business
            'from_phone' => '+0987654321',
            'from_name' => 'Test User',
            'message_content' => 'Hello'
        ];

        $response = $this->postJson('/api/v1/webhooks/whatsapp', $payload);

        $response->assertStatus(500)
                ->assertJsonStructure([
                    'success',
                    'message'
                ]);
    }
}