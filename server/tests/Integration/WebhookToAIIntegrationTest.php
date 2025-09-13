<?php

namespace Tests\Integration;

use App\Models\Business;
use App\Models\Client;
use App\Models\Conversation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebhookToAIIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_processes_complete_webhook_to_ai_flow()
    {
        // Setup: Create business with WhatsApp number
        $business = Business::factory()->create([
            'contact_phone' => '+1234567890',
            'name' => 'Test Salon',
            'brand_voice' => 'friendly'
        ]);

        // Step 1: Simulate WhatsApp webhook
        $webhookPayload = [
            'provider' => 'twilio',
            'to_phone' => '+1234567890',
            'from_phone' => '+0987654321',
            'from_name' => 'John Doe',
            'message_content' => 'Hi, I want to book a haircut for tomorrow at 3pm',
            'external_message_id' => 'msg_123'
        ];

        $webhookResponse = $this->postJson('/api/v1/webhooks/whatsapp', $webhookPayload);
        $webhookResponse->assertStatus(200);

        $webhookData = $webhookResponse->json()['data'];

        // Verify webhook created client and conversation
        $this->assertNotNull($webhookData['client']['id']);
        $this->assertNotNull($webhookData['conversation']['id']);
        $this->assertEquals('Hi, I want to book a haircut for tomorrow at 3pm', $webhookData['message']['message']);

        // Step 2: Process AI message (simulate what n8n would do)
        $aiPayload = [
            'conversation_id' => $webhookData['conversation']['id'],
            'client_id' => $webhookData['client']['id'],
            'message' => 'Hi, I want to book a haircut for tomorrow at 3pm',
            'force_booking_data' => [
                'service_id' => 1,
                'date' => now()->addDay()->format('Y-m-d'),
                'time' => '15:00'
            ]
        ];

        $aiResponse = $this->postJson('/api/v1/ai/process-message', $aiPayload);
        $aiResponse->assertStatus(200);

        $aiData = $aiResponse->json()['data'];

        // Verify AI processing worked
        $this->assertTrue($aiData['message_processed']);
        $this->assertContains('✅ User message stored', $aiData['flow_steps']);
        $this->assertContains('✅ Booking created successfully', $aiData['flow_steps']);
        $this->assertTrue($aiData['booking_created']);
        $this->assertNotNull($aiData['booking']);

        // Verify conversation has both messages
        $conversation = Conversation::find($webhookData['conversation']['id']);
        $this->assertEquals(2, $conversation->messages()->count()); // User + AI messages
    }

    /** @test */
    public function it_handles_webhook_followed_by_non_booking_ai_query()
    {
        // Setup
        $business = Business::factory()->create([
            'contact_phone' => '+1234567890'
        ]);

        // Webhook
        $webhookPayload = [
            'provider' => 'twilio',
            'to_phone' => '+1234567890',
            'from_phone' => '+0987654321',
            'from_name' => 'Jane Smith',
            'message_content' => 'What are your business hours?',
            'external_message_id' => 'msg_456'
        ];

        $webhookResponse = $this->postJson('/api/v1/webhooks/whatsapp', $webhookPayload);
        $webhookResponse->assertStatus(200);

        $webhookData = $webhookResponse->json()['data'];

        // AI Processing (non-booking query)
        $aiPayload = [
            'conversation_id' => $webhookData['conversation']['id'],
            'client_id' => $webhookData['client']['id'],
            'message' => 'What are your business hours?'
        ];

        $aiResponse = $this->postJson('/api/v1/ai/process-message', $aiPayload);
        $aiResponse->assertStatus(200);

        $aiData = $aiResponse->json()['data'];

        // Verify no booking was created
        $this->assertTrue($aiData['message_processed']);
        $this->assertFalse($aiData['booking_created']);
        $this->assertContains('ℹ️ No booking intent detected', $aiData['flow_steps']);
    }

    /** @test */
    public function it_handles_error_in_webhook_processing()
    {
        // Webhook with invalid business phone
        $webhookPayload = [
            'provider' => 'twilio',
            'to_phone' => '+19999999999', // Non-existent business
            'from_phone' => '+0987654321',
            'from_name' => 'Test User',
            'message_content' => 'Hello'
        ];

        $response = $this->postJson('/api/v1/webhooks/whatsapp', $webhookPayload);

        $response->assertStatus(500)
                ->assertJson([
                    'success' => false,
                    'message' => 'No business found for phone number: +19999999999'
                ]);
    }
}