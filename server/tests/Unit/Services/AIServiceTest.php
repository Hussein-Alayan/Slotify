<?php

namespace Tests\Unit\Services;

use App\Services\AIService;
use Illuminate\Support\Facades\Http;
use Mockery;
use Tests\TestCase;

class AIServiceTest extends TestCase
{
    private AIService $aiService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->aiService = new AIService();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_analyzes_booking_intent()
    {
        $this->mockHttpSuccess([
            'intent' => 'booking',
            'confidence' => 0.85,
            'extracted_data' => ['date' => 'tomorrow', 'time' => '3pm']
        ]);

        $result = $this->aiService->analyzeBookingIntent("Book haircut tomorrow 3pm");

        $this->assertEquals('booking', $result['intent']);
        $this->assertEquals(0.85, $result['confidence']);
        $this->assertEquals('tomorrow', $result['extracted_data']['date']);
    }

    /** @test */
    public function it_handles_non_booking_queries()
    {
        $this->mockHttpSuccess([
            'intent' => 'question',
            'confidence' => 0.3,
            'extracted_data' => ['date' => null, 'time' => null]
        ]);

        $result = $this->aiService->analyzeBookingIntent("What are your hours?");

        $this->assertEquals('question', $result['intent']);
        $this->assertEquals(0.3, $result['confidence']);
    }

    /** @test */
    public function it_handles_ai_service_errors()
    {
        $this->mockHttpFailure();

        $result = $this->aiService->analyzeBookingIntent("Book appointment");

        $this->assertEquals('other', $result['intent']);
        $this->assertEquals(0.0, $result['confidence']);
        $this->assertArrayHasKey('error', $result);
    }

    /** @test */
    public function it_generates_booking_success_response()
    {
        $this->mockHttpSuccess(['response' => 'Booking confirmed!']);

        $result = $this->aiService->generateBookingResponse(true, [
            'service' => 'Hair Cut',
            'date' => '2024-01-15'
        ], ['name' => 'Test Salon']);

        $this->assertStringContainsString('confirmed', $result);
    }

    /** @test */
    public function it_generates_booking_failure_response()
    {
        $this->mockHttpSuccess(['response' => 'Sorry, booking failed']);

        $result = $this->aiService->generateBookingResponse(false, [
            'error' => 'Time unavailable'
        ], ['name' => 'Test Salon']);

        $this->assertStringContainsString('issue', $result);
    }

    /** @test */
    public function it_generates_contextual_responses()
    {
        $this->mockHttpSuccess(['response' => 'We offer services']);

        $result = $this->aiService->generateContextualResponse(
            "What services?",
            1,
            ['name' => 'Test Salon']
        );

        $this->assertStringContainsString('Test Salon', $result);
    }

    /** @test */
    public function it_tests_ai_connection()
    {
        $this->mockHttpSuccess(['response' => 'OK']);

        $result = $this->aiService->testConnection();

        $this->assertTrue($result['connected']);
        $this->assertEquals('mistral', $result['model']);
    }

    private function mockHttpSuccess(array $response)
    {
        $mock = Mockery::mock();
        $mock->shouldReceive('successful')->andReturn(true);
        $mock->shouldReceive('json')->andReturn($response);

        Http::shouldReceive('timeout->post')->andReturn($mock);
    }

    private function mockHttpFailure()
    {
        $mock = Mockery::mock();
        $mock->shouldReceive('successful')->andReturn(false);
        $mock->shouldReceive('body')->andReturn('Connection failed');

        Http::shouldReceive('timeout->post')->andReturn($mock);
    }
}
