<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Business;
use App\Models\Client;
use App\Models\Service;
use App\Models\Resource;
use App\Models\BookingRule;
use App\Services\VoiceCallService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class VoiceCallControllerTest extends TestCase
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

    public function test_log_call_creates_new_voice_call()
    {
        $client = Client::factory()->create(['business_id' => $this->business->id]);
        
        $callData = [
            'business_id' => $this->business->id,
            'client_id' => $client->id,
            'caller_phone' => '+1234567890'
        ];

        $mockCall = (object) ['id' => 1];

        $voiceCallService = $this->mock(VoiceCallService::class);
        $voiceCallService->shouldReceive('logCall')
            ->once()
            ->with($callData)
            ->andReturn($mockCall);

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/voice/log', $callData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'call_id'
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'call_id' => 1
                ]
            ]);
    }

    public function test_log_call_without_business_id_and_client_id()
    {
        $callData = [
            'caller_phone' => '+1234567890'
        ];

        $expectedCallData = [
            'business_id' => null,
            'client_id' => null,
            'caller_phone' => '+1234567890'
        ];

        $mockCall = (object) ['id' => 2];

        $voiceCallService = $this->mock(VoiceCallService::class);
        $voiceCallService->shouldReceive('logCall')
            ->once()
            ->with($expectedCallData)
            ->andReturn($mockCall);

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/voice/log', $callData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'call_id' => 2
                ]
            ]);
    }

    public function test_update_transcript_updates_call_transcript()
    {
        $callId = 1;
        $transcript = 'This is the call transcript';

        $voiceCallService = $this->mock(VoiceCallService::class);
        $voiceCallService->shouldReceive('updateTranscript')
            ->once()
            ->with($callId, $transcript)
            ->andReturn(true);

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/voice/{$callId}/transcript", [
                'transcript' => $transcript
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success'
            ])
            ->assertJson([
                'success' => true
            ]);
    }

    public function test_update_transcript_handles_missing_transcript()
    {
        $callId = 1;

        // Since controller doesn't validate, this will pass null to service
        $voiceCallService = $this->mock(VoiceCallService::class);
        $voiceCallService->shouldReceive('updateTranscript')
            ->once()
            ->with($callId, null)
            ->andReturn(true);

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/voice/{$callId}/transcript", []);

        $response->assertStatus(200);
    }

    public function test_end_call_ends_voice_call()
    {
        $callId = 1;

        $voiceCallService = $this->mock(VoiceCallService::class);
        $voiceCallService->shouldReceive('endCall')
            ->once()
            ->with($callId)
            ->andReturn(true);

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/voice/{$callId}/end");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true
            ]);
    }

    public function test_get_business_context_returns_complete_business_data()
    {
        // Create test data
        $services = Service::factory()->count(3)->create([
            'business_id' => $this->business->id,
            'status' => 'active'
        ]);

        $inactiveService = Service::factory()->create([
            'business_id' => $this->business->id,
            'status' => 'inactive'
        ]);

        $resources = Resource::factory()->count(2)->create([
            'business_id' => $this->business->id
        ]);

        $bookingRules = BookingRule::factory()->count(2)->create([
            'business_id' => $this->business->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/voice/business-context/{$this->business->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'business_id',
                    'workflow' => [
                        'business' => [
                            'id',
                            'name',
                            'industry',
                            'contact_email',
                            'contact_phone',
                            'address',
                            'brand_voice',
                            'created_at',
                            'updated_at',
                            'timezone',
                            'business_hours',
                            'status',
                            'user_id',
                            'booking_rules'
                        ],
                        'services',
                        'resources',
                        'booking_rules'
                    ]
                ]
            ])
            ->assertJson([
                'success' => true,
                'data' => [
                    'business_id' => $this->business->id
                ]
            ]);

        // Verify only active services are returned (3, not 4)
        $this->assertCount(3, $response->json('data.workflow.services'));
        
        // Verify all resources are returned
        $this->assertCount(2, $response->json('data.workflow.resources'));
        
        // Verify booking rules includes the created ones (may include existing ones)
        $this->assertGreaterThanOrEqual(2, count($response->json('data.workflow.booking_rules')));
    }

    public function test_get_business_context_handles_business_not_found()
    {
        $invalidBusinessId = 99999;

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/voice/business-context/{$invalidBusinessId}");

        $response->assertStatus(404);
    }

    public function test_get_business_context_returns_empty_arrays_when_no_data()
    {
        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/voice/business-context/{$this->business->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'business_id' => $this->business->id,
                    'workflow' => [
                        'services' => [],
                        'resources' => [],
                        'booking_rules' => []
                    ]
                ]
            ]);
    }

    public function test_voice_call_endpoints_work_without_authentication_for_testing()
    {
        // Note: Voice routes are public per api.php configuration
        $endpoints = [
            ['method' => 'post', 'url' => '/api/v1/voice/log'],
            ['method' => 'post', 'url' => '/api/v1/voice/1/transcript'],
            ['method' => 'post', 'url' => '/api/v1/voice/1/end'],
            ['method' => 'get', 'url' => "/api/v1/voice/business-context/{$this->business->id}"]
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->{$endpoint['method'] . 'Json'}($endpoint['url']);
            // Expect some response (not 401) since routes are public
            $this->assertNotEquals(401, $response->getStatusCode());
        }
    }

    public function test_log_call_handles_service_exceptions()
    {
        $callData = [
            'caller_phone' => '+1234567890'
        ];

        $voiceCallService = $this->mock(VoiceCallService::class);
        $voiceCallService->shouldReceive('logCall')
            ->once()
            ->andThrow(new \Exception('Service error'));

        $response = $this->actingAs($this->user)
            ->postJson('/api/v1/voice/log', $callData);

        $response->assertStatus(500);
    }

    public function test_update_transcript_handles_service_exceptions()
    {
        $callId = 1;
        $transcript = 'Test transcript';

        $voiceCallService = $this->mock(VoiceCallService::class);
        $voiceCallService->shouldReceive('updateTranscript')
            ->once()
            ->andThrow(new \Exception('Service error'));

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/voice/{$callId}/transcript", [
                'transcript' => $transcript
            ]);

        $response->assertStatus(500);
    }

    public function test_end_call_handles_service_exceptions()
    {
        $callId = 1;

        $voiceCallService = $this->mock(VoiceCallService::class);
        $voiceCallService->shouldReceive('endCall')
            ->once()
            ->andThrow(new \Exception('Service error'));

        $response = $this->actingAs($this->user)
            ->postJson("/api/v1/voice/{$callId}/end");

        $response->assertStatus(500);
    }

    public function test_get_business_context_includes_correct_business_data()
    {
        // Update business with specific data
        $this->business->update([
            'industry' => 'Healthcare',
            'contact_email' => 'test@business.com',
            'contact_phone' => '+1234567890',
            'address' => '123 Test Street',
            'brand_voice' => 'Professional and friendly',
            'timezone' => 'America/New_York',
            'business_hours' => '9:00-17:00',
            'status' => 'active'
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/v1/voice/business-context/{$this->business->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.workflow.business.industry', 'Healthcare')
            ->assertJsonPath('data.workflow.business.contact_email', 'test@business.com')
            ->assertJsonPath('data.workflow.business.contact_phone', '+1234567890')
            ->assertJsonPath('data.workflow.business.address', '123 Test Street')
            ->assertJsonPath('data.workflow.business.brand_voice', 'Professional and friendly')
            ->assertJsonPath('data.workflow.business.timezone', 'America/New_York')
            ->assertJsonPath('data.workflow.business.business_hours', '9:00-17:00')
            ->assertJsonPath('data.workflow.business.status', 'active');
    }
}