<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AIService
{
    private $ollamaUrl;
    private $model = 'mistral';

    public function __construct()
    {
        // For Docker: use host.docker.internal to reach host machine
        // For local development: use localhost
        $this->ollamaUrl = env('OLLAMA_URL', 'http://host.docker.internal:11434/api/generate');
    }

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
            // Fallback responses if AI is unavailable - make them more dynamic
            if ($success) {
                $serviceName = $details['service'] ?? 'appointment';
                $dateStr = isset($details['date']) ? Carbon::parse($details['date'])->format('M j') : 'soon';
                return "Perfect! I've booked your {$serviceName} for {$dateStr}. We'll see you then!";
            } else {
                $error = $details['error'] ?? 'a scheduling conflict';
                return "I'm sorry, there was {$error}. Let me help you find another time that works better.";
            }
        }

        return $response;
    }

    /**
     * Generate a contextual response for non-booking messages
     */
    public function generateContextualResponse(string $message, int $businessId): string
    {
        // You could load business info here for more context
        $prompt = "Generate a helpful, friendly customer service response to this message.
        
Customer message: \"{$message}\"

Guidelines:
- Be helpful and professional
- If they're asking about services, mention you can help with bookings
- If they're asking general questions, offer assistance
- Keep it concise and warm

Response:";

        $response = $this->sendPrompt($prompt);
        
        if (!$response) {
            // Dynamic fallback based on message content
            $message = strtolower($message);
            if (str_contains($message, 'service') || str_contains($message, 'what')) {
                return "I'd be happy to help you learn about our services and schedule an appointment. What would you like to know?";
            } elseif (str_contains($message, 'hour') || str_contains($message, 'time') || str_contains($message, 'when')) {
                return "I can help you find a great time for your appointment. What service are you interested in?";
            } else {
                return "Thank you for reaching out! I'm here to help with any questions and to assist with booking appointments. How can I help you today?";
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
