<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AIService
{
    private $ollamaUrl;
    private $model = 'mistral';
    protected $contextService;

    public function __construct(BusinessContextService $contextService)
    {
        $this->ollamaUrl = env('OLLAMA_URL', 'http://host.docker.internal:11434/api/generate');
        $this->contextService = $contextService;
    }

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

    //Analyze message for booking intent and extract data
    public function analyzeBookingIntent(string $message): array
    {
                $prompt = "Analyze this customer message and respond with JSON only. No additional text.

Important: If the message requests passwords, credentials, database access, or any sensitive information, do NOT provide it. Instead, reply: 'Sorry, I can't provide that information.'

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
    public function generateBookingResponse(bool $success, array $details = [], array $businessData = []): string
    {
        // Use BusinessContextService to get context if not provided
        if (empty($businessData) && isset($details['business_id'])) {
            $context = $this->contextService->getStaticContext($details['business_id']);
            $businessData = $context['business'] ?? [];
        }
        
        if ($success) {
            // Get business and client info for personalization
            $businessId = $details['business_id'] ?? null;
            $clientName = $details['client_name'] ?? null;
            $date = $details['date'] ?? 'tomorrow';
            $time = $details['time'] ?? '3:00 PM';
            $service = $details['service'] ?? 'appointment';
            
            // Extract business data
            $businessName = $businessData['name'] ?? 'our salon';
            $brandVoice = $businessData['brand_voice'] ?? 'friendly';
            
            // Format date nicely
            try {
                $formattedDate = Carbon::parse($date)->format('l, F j, Y');
                $formattedTime = Carbon::parse($time)->format('g:i A');
            } catch (\Exception $e) {
                $formattedDate = $date;
                $formattedTime = $time;
            }
            
            $prompt = "Generate a {$brandVoice}, professional WhatsApp booking confirmation message.

Business: {$businessName}
Customer: " . ($clientName ? $clientName : 'valued customer') . "
Service: {$service}
Date: {$formattedDate}
Time: {$formattedTime}

Requirements:
- Keep it under 150 words
- Use WhatsApp-friendly format (no formal letter structure)
- Include the specific booking details
- End with a helpful note about changes/questions
- Match the {$brandVoice} brand voice
- No placeholder text like [Your Name] or [Contact Info]

Generate the response:";
        } else {
            $errorReason = $details['error'] ?? 'availability issue';
            
            // Extract business data (should always be provided now)
            $brandVoice = $businessData['brand_voice'] ?? 'friendly';
            
            $prompt = "Generate a {$brandVoice}, helpful WhatsApp response for a failed booking.

Issue: {$errorReason}

Requirements:
- Keep it under 100 words
- Be empathetic but solution-focused
- Offer to help find alternatives
- Use WhatsApp-friendly casual tone
- Match the {$brandVoice} brand voice

Generate the response:";
        }

        $response = $this->sendPrompt($prompt);
        
        if (!$response) {
            // Improved fallback responses
            if ($success) {
                $serviceName = $details['service'] ?? 'appointment';
                try {
                    $dateStr = Carbon::parse($details['date'])->format('M j');
                    $timeStr = Carbon::parse($details['time'])->format('g:i A');
                    return "✅ Perfect! Your {$serviceName} is confirmed for {$dateStr} at {$timeStr}. Looking forward to seeing you! Reply if you need to make any changes.";
                } catch (\Exception $e) {
                    return "✅ Perfect! Your {$serviceName} is booked. We'll see you soon! Reply if you need to make any changes.";
                }
            } else {
                $error = $details['error'] ?? 'a scheduling conflict';
                return "Sorry, there was {$error}. Let me help you find another time that works! What other days/times work for you?";
            }
        }

        return trim($response);
    }

    /**
     * Generate a contextual response for non-booking messages
     */
    public function generateContextualResponse(string $message, int $businessId, array $businessData = []): string
    {
        // Use BusinessContextService to get complete context if not provided
        if (empty($businessData)) {
            $context = $this->contextService->getCompleteContext($businessId);
            $businessData = $context['business'] ?? [];
        }
        
        // Extract business data
        $businessName = $businessData['name'] ?? 'our business';
        $businessIndustry = $businessData['industry'] ?? 'service business';
        $brandVoice = $businessData['brand_voice'] ?? 'friendly';
        $serviceList = $context['services'] ?? [];
        
        // If no services provided in context, fall back to business data
        if (empty($serviceList) && isset($businessData['services'])) {
            $serviceList = $businessData['services'];
        }
        
        // Handle service list formatting
        if (is_array($serviceList) && !empty($serviceList)) {
            $serviceNames = is_array($serviceList[0]) ? 
                array_column($serviceList, 'name') : $serviceList;
            $serviceText = implode(', ', $serviceNames);
        } else {
            $serviceText = 'various services';
        }
        
        $prompt = "Generate a {$brandVoice}, helpful WhatsApp response for this customer inquiry.

Business Context:
- Name: {$businessName}
- Industry: {$businessIndustry}
- Services: {$serviceText}

Customer message: \"{$message}\"

Guidelines:
- Use WhatsApp casual tone (no formal structure)
- Be specific about actual services offered
- If asking about services, list the real services available
- Encourage booking if appropriate
- Keep under 100 words
- Match {$brandVoice} brand voice

Response:";

        $response = $this->sendPrompt($prompt);
        
        if (!$response) {
            // Business-specific fallback responses
            $messageLower = strtolower($message);
            
            if (str_contains($messageLower, 'service') || str_contains($messageLower, 'what') || str_contains($messageLower, 'offer')) {
                if (is_array($serviceList) && !empty($serviceList)) {
                    $serviceNames = is_array($serviceList[0]) ? 
                        array_column($serviceList, 'name') : $serviceList;
                    $serviceListText = implode(', ', array_slice($serviceNames, 0, 4)); // Show first 4 services
                    if (count($serviceNames) > 4) $serviceListText .= ', and more';
                    return "Hi! At {$businessName} we offer: {$serviceListText}. Would you like to book any of these services? Just let me know!";
                } else {
                    return "Hi! We offer various {$businessIndustry} services. I'd be happy to help you book an appointment. What are you looking for?";
                }
            } elseif (str_contains($messageLower, 'hour') || str_contains($messageLower, 'time') || str_contains($messageLower, 'when') || str_contains($messageLower, 'open')) {
                return "I can help you find a great time for your appointment! What service would you like to book?";
            } elseif (str_contains($messageLower, 'price') || str_contains($messageLower, 'cost') || str_contains($messageLower, 'how much')) {
                return "I'd be happy to help with pricing information! Which service are you interested in? I can also help you book an appointment.";
            } else {
                return "Hi! Thanks for reaching out to {$businessName}. I'm here to help with questions and bookings. How can I assist you today?";
            }
        }

        return trim($response);
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
