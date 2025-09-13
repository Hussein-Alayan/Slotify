<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Client;
use App\Models\Conversation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AIProcessingTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_processes_ai_message_and_creates_booking()
    {
        // Mock AIService to always return booking intent with high confidence
        $this->mock(\App\Services\AIService::class, function ($mock) {
            $mock->shouldReceive('analyzeBookingIntent')->andReturn([
                'intent' => 'booking',
                'confidence' => 1.0,
                'extracted_data' => [
                    'date' => now()->toDateString(),
                    'time' => '15:00',
                    'service' => 'Haircut',
                ],
            ]);
            $mock->shouldReceive('generateBookingResponse')->andReturn('Your booking is confirmed.');
            $mock->shouldReceive('generateContextualResponse')->andReturn('How can I help you?');
        });

        $business = Business::factory()->create();
        \App\Models\BookingRule::factory()->create([
            'business_id' => $business->id
        ]);
        $service = \App\Models\Service::factory()->create(['business_id' => $business->id]);
        $client = Client::factory()->create(['business_id' => $business->id]);
        $conversation = Conversation::factory()->create([
            'business_id' => $business->id,
            'client_id' => $client->id
        ]);

        // Ensure booking is not on Sunday (unavailable)
        $tomorrow = now()->addDay();
        if ($tomorrow->isSunday()) {
            $bookingDate = $tomorrow->addDay()->toDateString(); // Monday
        } else {
            $bookingDate = $tomorrow->toDateString();
        }

        $payload = [
            'conversation_id' => $conversation->id,
            'client_id' => $client->id,
            'message' => 'I want to book a haircut for tomorrow at 3pm',
            'force_booking_data' => [
                'service_id' => $service->id,
                'date' => $bookingDate,
                'time' => '15:00'
            ]
        ];

        $response = $this->postJson('/api/v1/ai/process-message', $payload);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'message_processed',
                         'flow_steps',
                         'ai_analysis',
                         'booking_created',
                         'conversation_summary'
                     ]
                 ]);

        $responseData = $response->json()['data'];
        $this->assertTrue($responseData['message_processed']);

        if (!$responseData['booking_created']) {
            fwrite(STDOUT, "Booking creation failed. Response data: " . print_r($responseData, true) . "\n");
        }

        $this->assertTrue($responseData['booking_created']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_processes_ai_message_without_booking()
    {
        $business = Business::factory()->create();
        $client = Client::factory()->create(['business_id' => $business->id]);
        $conversation = Conversation::factory()->create([
            'business_id' => $business->id,
            'client_id' => $client->id
        ]);

        $payload = [
            'conversation_id' => $conversation->id,
            'client_id' => $client->id,
            'message' => 'What are your business hours?'
        ];

        $response = $this->postJson('/api/v1/ai/process-message', $payload);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'message_processed',
                         'flow_steps',
                         'ai_analysis',
                         'booking_created',
                         'conversation_summary'
                     ]
                 ]);

        $responseData = $response->json()['data'];
        $this->assertTrue($responseData['message_processed']);
        $this->assertFalse($responseData['booking_created']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_handles_missing_conversation()
    {
        $payload = [
            'conversation_id' => 999, // Non-existent
            'client_id' => 1,
            'message' => 'Test message'
        ];

        $response = $this->postJson('/api/v1/ai/process-message', $payload);

        $response->assertStatus(422)
                 ->assertJsonStructure([
                     'message',
                     'errors' => [
                         'conversation_id',
                         'client_id'
                     ]
                 ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_handles_invalid_request_data()
    {
        $payload = [
            'conversation_id' => 'invalid',
            'message' => ''
        ];

        $response = $this->postJson('/api/v1/ai/process-message', $payload);

        $response->assertStatus(422); // Validation error
    }
}
