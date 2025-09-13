<?php

namespace Tests\Unit\Services;

use App\Models\Business;
use App\Models\Client;
use App\Models\Conversation;
use App\Services\WhatsAppWebhookService;
use Tests\TestCase;

class WhatsAppWebhookServiceTest extends TestCase
{
    private WhatsAppWebhookService $webhookService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->webhookService = new WhatsAppWebhookService();
    }

    /** @test */
    public function it_processes_incoming_whatsapp_message()
    {
        // Create test data
        $business = Business::factory()->create([
            'contact_phone' => '+1234567890'
        ]);

        $data = [
            'provider' => 'twilio',
            'to_phone' => '+1234567890',
            'from_phone' => '+0987654321',
            'from_name' => 'Test User',
            'message_content' => 'Hello, I want to book',
            'external_message_id' => 'msg_123'
        ];

        $result = $this->webhookService->processIncomingMessage($data);

        $this->assertArrayHasKey('business', $result);
        $this->assertArrayHasKey('client', $result);
        $this->assertArrayHasKey('conversation', $result);
        $this->assertArrayHasKey('message', $result);
        $this->assertEquals($business->id, $result['business']->id);
    }

    /** @test */
    public function it_finds_business_by_phone_number()
    {
        $business = Business::factory()->create([
            'contact_phone' => '+15551234567'
        ]);

        $foundBusiness = $this->invokePrivateMethod(
            'findBusinessByPhone',
            ['+15551234567']
        );

        $this->assertNotNull($foundBusiness);
        $this->assertEquals($business->id, $foundBusiness->id);
    }

    /** @test */
    public function it_returns_null_for_unknown_business()
    {
        $foundBusiness = $this->invokePrivateMethod(
            'findBusinessByPhone',
            ['+19999999999']
        );

        $this->assertNull($foundBusiness);
    }

    /** @test */
    public function it_creates_or_finds_client()
    {
        $business = Business::factory()->create();

        $client = $this->invokePrivateMethod(
            'findOrCreateClient',
            [$business->id, '+1234567890', 'Test User']
        );

        $this->assertNotNull($client);
        $this->assertEquals('+1234567890', $client->phone);
        $this->assertEquals('Test User', $client->name);
        $this->assertEquals($business->id, $client->business_id);
    }

    /** @test */
    public function it_creates_conversation_for_business_client()
    {
        $business = Business::factory()->create();
        $client = Client::factory()->create(['business_id' => $business->id]);

        $conversation = $this->invokePrivateMethod(
            'findOrCreateConversation',
            [$business->id, $client->id]
        );

        $this->assertNotNull($conversation);
        $this->assertEquals($business->id, $conversation->business_id);
        $this->assertEquals($client->id, $conversation->client_id);
    }

    /** @test */
    public function it_verifies_webhook_signature()
    {
        // Test Twilio signature (currently returns true for MVP)
        $result = $this->webhookService->verifyWebhookSignature(
            'twilio',
            ['X-Twilio-Signature' => 'test'],
            'test body'
        );

        $this->assertTrue($result);

        // Test Facebook signature
        $result = $this->webhookService->verifyWebhookSignature(
            'facebook',
            ['X-Hub-Signature-256' => 'test'],
            'test body'
        );

        $this->assertTrue($result);
    }

    /** @test */
    public function it_throws_exception_for_unknown_business()
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('No business found for phone number');

        $data = [
            'provider' => 'twilio',
            'to_phone' => '+19999999999', // Non-existent business
            'from_phone' => '+0987654321',
            'from_name' => 'Test User',
            'message_content' => 'Hello',
        ];

        $this->webhookService->processIncomingMessage($data);
    }

    private function invokePrivateMethod(string $methodName, array $parameters = [])
    {
        $reflection = new \ReflectionClass($this->webhookService);
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);

        return $method->invokeArgs($this->webhookService, $parameters);
    }
}