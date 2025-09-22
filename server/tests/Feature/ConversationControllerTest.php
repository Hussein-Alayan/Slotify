<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Business;
use App\Models\Client;
use App\Models\Conversation;
use App\Models\ConversationMessage;
use App\Services\ConversationService;
use App\Http\Resources\ConversationResource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ConversationControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected Business $business;
    protected Client $client;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->business = Business::factory()->create(['user_id' => $this->user->id]);
        $this->client = Client::factory()->create(['business_id' => $this->business->id]);
    }

    public function test_start_conversation_creates_new_conversation()
    {
        $conversation = Conversation::factory()->create([
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ]);

        $conversationService = $this->mock(ConversationService::class);
        $conversationService->shouldReceive('startConversation')
            ->once()
            ->with($this->client->id, null, $this->business->id)
            ->andReturn($conversation);

        $payload = [
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/conversations', $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'client_id',
                    'business_id'
                ]
            ]);
    }

    public function test_start_conversation_with_agent_id()
    {
        $agentId = 123;
        $conversation = Conversation::factory()->create([
            'client_id' => $this->client->id,
            'business_id' => $this->business->id,
            'agent_id' => $agentId
        ]);

        $conversationService = $this->mock(ConversationService::class);
        $conversationService->shouldReceive('startConversation')
            ->once()
            ->with($this->client->id, $agentId, $this->business->id)
            ->andReturn($conversation);

        $payload = [
            'client_id' => $this->client->id,
            'agent_id' => $agentId,
            'business_id' => $this->business->id
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/conversations', $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'client_id',
                    'business_id',
                    'agent_id'
                ]
            ]);
    }

    public function test_start_conversation_validates_required_fields()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/conversations', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['client_id', 'business_id']);
    }

    public function test_start_conversation_handles_service_exceptions()
    {
        $conversationService = $this->mock(ConversationService::class);
        $conversationService->shouldReceive('startConversation')
            ->once()
            ->andThrow(new \InvalidArgumentException('Invalid client ID'));

        $payload = [
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/conversations', $payload);

        $response->assertStatus(400)
            ->assertJsonStructure([
                'success',
                'message'
            ])
            ->assertJson([
                'success' => false
            ]);
    }

    public function test_show_returns_conversation_with_messages()
    {
        $conversation = Conversation::factory()->create([
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ]);

        $conversationService = $this->mock(ConversationService::class);
        $conversationService->shouldReceive('getConversationWithMessages')
            ->once()
            ->with($conversation->id)
            ->andReturn($conversation);

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/conversations/{$conversation->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'client_id',
                    'business_id'
                ]
            ]);
    }

    public function test_show_handles_conversation_not_found()
    {
        $invalidConversationId = 99999;

        $conversationService = $this->mock(ConversationService::class);
        $conversationService->shouldReceive('getConversationWithMessages')
            ->once()
            ->with($invalidConversationId)
            ->andThrow(new \Illuminate\Database\Eloquent\ModelNotFoundException());

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/conversations/{$invalidConversationId}");

        $response->assertStatus(404);
    }

    public function test_send_message_in_conversation()
    {
        $conversation = Conversation::factory()->create([
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ]);

        $timestamp = '2025-09-22T08:44:46.828078Z';
        $messageData = [
            'sender' => 'user',
            'message' => 'Hello, I need help with my appointment',
            'metadata' => ['timestamp' => $timestamp]
        ];

        $mockMessage = new ConversationMessage([
            'id' => 1,
            'conversation_id' => $conversation->id,
            'sender' => 'user',
            'message' => 'Hello, I need help with my appointment'
        ]);
        $mockMessage->id = 1;

        $conversationService = $this->mock(ConversationService::class);
        $conversationService->shouldReceive('sendMessage')
            ->once()
            ->with(
                $conversation->id,
                $conversation->client_id,
                $conversation->business_id,
                'user',
                'Hello, I need help with my appointment',
                ['timestamp' => $timestamp]
            )
            ->andReturn($mockMessage);

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", $messageData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'message' => [
                        'id',
                        'conversation_id',
                        'sender',
                        'message'
                    ]
                ]
            ]);
    }

    public function test_send_message_validates_required_fields()
    {
        $conversation = Conversation::factory()->create([
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ]);

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['sender', 'message']);
    }

    public function test_send_message_handles_service_exceptions()
    {
        $conversation = Conversation::factory()->create([
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ]);

        $messageData = [
            'sender' => 'user',
            'message' => 'Hello, I need help with my appointment'
        ];

        $conversationService = $this->mock(ConversationService::class);
        $conversationService->shouldReceive('sendMessage')
            ->once()
            ->andThrow(new \Exception('Message sending failed'));

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", $messageData);

        $response->assertStatus(400)
            ->assertJsonStructure([
                'success',
                'message'
            ])
            ->assertJson([
                'success' => false
            ]);
    }

    public function test_send_message_without_metadata()
    {
        $conversation = Conversation::factory()->create([
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ]);

        $messageData = [
            'sender' => 'ai',
            'message' => 'Thank you for contacting us'
        ];

        $mockMessage = new ConversationMessage([
            'id' => 2,
            'conversation_id' => $conversation->id,
            'sender' => 'ai',
            'message' => 'Thank you for contacting us'
        ]);
        $mockMessage->id = 2;

        $conversationService = $this->mock(ConversationService::class);
        $conversationService->shouldReceive('sendMessage')
            ->once()
            ->with(
                $conversation->id,
                $conversation->client_id,
                $conversation->business_id,
                'ai',
                'Thank you for contacting us',
                null
            )
            ->andReturn($mockMessage);

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/conversations/{$conversation->id}/messages", $messageData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'message'
                ]
            ]);
    }

    public function test_conversation_endpoints_handle_public_access()
    {
        $conversation = Conversation::factory()->create([
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ]);

        // Test unauthenticated requests (routes are public)
        $this->postJson('/api/v1/conversations', [
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ])->assertStatus(200); // Public route, creates conversation

        $this->getJson("/api/v1/conversations/{$conversation->id}")
            ->assertStatus(200); // Public route
            
        $this->postJson("/api/v1/conversations/{$conversation->id}/messages", [
            'sender' => 'user',
            'message' => 'test'
        ])->assertStatus(201); // Routes are public and work without auth
    }

    public function test_send_message_handles_conversation_not_found()
    {
        $invalidConversationId = 99999;

        $messageData = [
            'sender' => 'user',
            'message' => 'Hello'
        ];

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/conversations/{$invalidConversationId}/messages", $messageData);

        $response->assertStatus(400); // Controller catches ModelNotFoundException and returns 400
    }

    public function test_start_conversation_validates_client_belongs_to_business()
    {
        // Create a client for a different business
        $otherBusiness = Business::factory()->create();
        $otherClient = Client::factory()->create(['business_id' => $otherBusiness->id]);

        $payload = [
            'client_id' => $otherClient->id,
            'business_id' => $this->business->id
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/conversations', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['client_id']);
    }

    public function test_conversation_resource_structure()
    {
        $conversation = Conversation::factory()->create([
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ]);

        $conversationService = $this->mock(ConversationService::class);
        $conversationService->shouldReceive('startConversation')
            ->once()
            ->andReturn($conversation);

        $payload = [
            'client_id' => $this->client->id,
            'business_id' => $this->business->id
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/conversations', $payload);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'client_id',
                    'business_id',
                    'created_at',
                    'updated_at'
                ]
            ])
            ->assertJson([
                'success' => true
            ]);
    }
}