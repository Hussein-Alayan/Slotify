<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    private $ollamaUrl = 'http://localhost:11434/api/generate';
    private $model = 'mistral';

    /**
     * Send a prompt to Ollama and get response
     */
    private function sendPrompt(string $prompt, bool $stream = false): ?string
    {
        try {
            $response = Http::timeout(60)->post($this->ollamaUrl, [
                'model' => $this->model,
                'prompt' => $prompt,
                'stream' => $stream,
                'options' => [
                    'temperature' => 0.1, // Lower temperature for more consistent responses
                    'top_p' => 0.9,
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['response'] ?? null;
            }

            Log::error('Ollama API error: ' . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error('Failed to connect to Ollama: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Analyze message for booking intent and extract data
     */
    public function analyzeBookingIntent(string $message): array
    {
        $prompt = "Analyze this customer message and respond with JSON only. No additional text.

Message: \"{$message}\"

Response format:
{
  \"intent\": \"booking\" or \"question\" or \"other\",
  \"confidence\": 0.0-1.0,
  \"extracted_data\": {
    \"date\": \"extracted date or null\",
    \"time\": \"extracted time or null\", 
    \"service\": \"extracted service type or null\"
  }
}

JSON Response:";

        $response = $this->sendPrompt($prompt);
        
        if (!$response) {
            return [
                'intent' => 'other',
                'confidence' => 0.0,
                'extracted_data' => [
                    'date' => null,
                    'time' => null,
                    'service' => null
                ],
                'error' => 'Failed to get AI response'
            ];
        }

        // Try to parse JSON response
        $decoded = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            // If JSON parsing fails, try to extract intent with fallback logic
            return $this->fallbackIntentAnalysis($message, $response);
        }

        return $decoded;
    }

    /**
     * Generate a natural response for booking results
     */
    public function generateBookingResponse(bool $success, array $details = []): string
    {
        if ($success) {
            $date = $details['date'] ?? 'tomorrow';
            $time = $details['time'] ?? '3:00 PM';
            $service = $details['service'] ?? 'appointment';
            
            $prompt = "Generate a friendly, professional customer service response confirming a successful appointment booking.

Booking Details:
- Date: {$date}
- Time: {$time}
- Service: {$service}

Generate a natural, warm confirmation message:";
        } else {
            $errorReason = $details['error'] ?? 'availability issue';
            $prompt = "Generate a polite, helpful customer service response for a failed booking attempt.

Issue: {$errorReason}

Generate a natural, empathetic response that offers to help find alternatives:";
        }

        $response = $this->sendPrompt($prompt);
        
        if (!$response) {
            // Fallback responses if AI is unavailable
            if ($success) {
                return "Great! I've successfully booked your appointment. Looking forward to seeing you!";
            } else {
                return "I apologize, but I wasn't able to complete your booking at this time. Let me help you find an alternative time.";
            }
        }

        return $response;
    }

    /**
     * Fallback intent analysis if JSON parsing fails
     */
    private function fallbackIntentAnalysis(string $message, string $aiResponse): array
    {
        $message = strtolower($message);
        $bookingKeywords = ['book', 'appointment', 'schedule', 'reserve', 'meeting'];
        
        $hasBookingIntent = false;
        foreach ($bookingKeywords as $keyword) {
            if (str_contains($message, $keyword)) {
                $hasBookingIntent = true;
                break;
            }
        }

        return [
            'intent' => $hasBookingIntent ? 'booking' : 'other',
            'confidence' => $hasBookingIntent ? 0.7 : 0.3,
            'extracted_data' => [
                'date' => $this->extractDate($message),
                'time' => $this->extractTime($message),
                'service' => null
            ],
            'ai_raw_response' => $aiResponse,
            'fallback_used' => true
        ];
    }

    /**
     * Simple date extraction from message
     */
    private function extractDate(string $message): ?string
    {
        if (str_contains($message, 'tomorrow')) {
            return 'tomorrow';
        }
        if (str_contains($message, 'today')) {
            return 'today';
        }
        // Add more date patterns as needed
        return null;
    }

    /**
     * Simple time extraction from message
     */
    private function extractTime(string $message): ?string
    {
        // Look for time patterns like "3pm", "3:00 pm", "15:00"
        if (preg_match('/(\d{1,2}):?(\d{2})?\s*(am|pm)/i', $message, $matches)) {
            return $matches[0];
        }
        if (preg_match('/(\d{1,2})\s*(am|pm)/i', $message, $matches)) {
            return $matches[0];
        }
        return null;
    }

    /**
     * Test connection to Ollama
     */
    public function testConnection(): array
    {
        $testPrompt = "Respond with 'OK' if you can hear me.";
        $response = $this->sendPrompt($testPrompt);
        
        return [
            'connected' => $response !== null,
            'model' => $this->model,
            'url' => $this->ollamaUrl,
            'response' => $response
        ];
    }
}
