<?php

namespace Tests\Unit\Services;

use App\Services\AIService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AIServiceTest extends TestCase
{
    private AIService $aiService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->aiService = new AIService();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_analyzes_booking_intent()
    {
        Http::fake([
            '*' => Http::response([
                'response' => json_encode([
                    'intent' => 'booking',
                    'confidence' => 0.85,
                    'extracted_data' => ['date' => 'tomorrow', 'time' => '3pm', 'service' => null]
                ])
            ])
        ]);

        $result = $this->aiService->analyzeBookingIntent("Book haircut tomorrow 3pm");

        $this->assertEquals('booking', $result['intent']);
        $this->assertEquals(0.85, $result['confidence']);
        $this->assertEquals('tomorrow', $result['extracted_data']['date']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_handles_non_booking_queries()
    {
        Http::fake([
            '*' => Http::response([
                'response' => json_encode([
                    'intent' => 'question',
                    'confidence' => 0.3,
                    'extracted_data' => ['date' => null, 'time' => null, 'service' => null]
                ])
            ])
        ]);

        $result = $this->aiService->analyzeBookingIntent("What are your hours?");

        $this->assertEquals('question', $result['intent']);
        $this->assertEquals(0.3, $result['confidence']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_handles_ai_service_errors()
    {
        Http::fake([
            '*' => Http::response(null, 500)
        ]);

        $result = $this->aiService->analyzeBookingIntent("Book appointment");

        $this->assertEquals('other', $result['intent']);
        $this->assertEquals(0.0, $result['confidence']);
        $this->assertArrayHasKey('error', $result);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_generates_booking_success_response()
    {
        Http::fake([
            '*' => Http::response(['response' => 'Booking confirmed!'])
        ]);

        $result = $this->aiService->generateBookingResponse(true, [
            'service' => 'Hair Cut',
            'date' => '2024-01-15'
        ], ['name' => 'Test Salon']);

        $this->assertStringContainsString('confirmed', $result);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_generates_booking_failure_response()
    {
        Http::fake([
            '*' => Http::response(['response' => 'Sorry, booking failed'])
        ]);

        $result = $this->aiService->generateBookingResponse(false, [
            'error' => 'Time unavailable'
        ], ['name' => 'Test Salon']);

        $this->assertStringContainsString('Sorry, booking failed', $result);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_generates_contextual_responses()
    {
        Http::fake([
            '*' => Http::response(['response' => 'We offer services'])
        ]);

        $result = $this->aiService->generateContextualResponse(
            "What services?",
            1,
            ['name' => 'Test Salon']
        );

        $this->assertStringContainsString('We offer services', $result);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_tests_ai_connection()
    {
        Http::fake([
            '*' => Http::response(['response' => 'OK'])
        ]);

        $result = $this->aiService->testConnection();

        $this->assertTrue($result['connected']);
        $this->assertEquals('mistral', $result['model']);
    }
}
