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
    /**
     * Generate a contextual response based on customer message
     *
     * @param string $message Customer message
     * @param int $businessId Business ID
     * @param array $businessData Optional business data
     * @return string Response from AI
     */
    public function generateContextualResponse(string $message, int $businessId, array $businessData = []): string
    {
        // Check if this is an availability question
        $isAvailabilityQuestion = $this->isAvailabilityQuestion($message);
        
        // Get AI context with availability data
        $context = $this->contextService->getAIContext($businessId);
        
        // If it's an availability question, use special prompt
        if ($isAvailabilityQuestion) {
            return $this->generateAvailabilityResponse($message, $context);
        }
        
        // Extract business data
        $businessName = $context['business']['name'] ?? 'our business';
        $businessIndustry = $context['business']['industry'] ?? 'service business';
        $brandVoice = $context['business']['brand_voice'] ?? 'friendly';
        $serviceList = $context['services'] ?? [];
        
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
    
    /**
     * Check if a message is asking about resource/staff availability
     *
     * @param string $message The customer message
     * @return bool True if this is an availability question
     */
    private function isAvailabilityQuestion(string $message): bool
    {
        $message = strtolower($message);
        
        // Keywords related to availability
        $availabilityKeywords = [
            'available', 'free', 'open', 'book', 'schedule', 'appointment',
            'slot', 'time', 'when can', 'is there', 'do you have'
        ];
        
        // Keywords related to staff/resources
        $resourceKeywords = [
            'staff', 'person', 'people', 'employee', 'worker', 'specialist',
            'technician', 'stylist', 'therapist', 'doctor', 'provider'
        ];
        
        // Check for time indicators
        $hasTimeIndicator = $this->extractTime($message) !== null || 
                          $this->extractDate($message) !== null ||
                          preg_match('/(today|tomorrow|next week|this week|weekend)/i', $message);
        
        // Check for availability keywords
        $hasAvailabilityKeyword = false;
        foreach ($availabilityKeywords as $keyword) {
            if (strpos($message, $keyword) !== false) {
                $hasAvailabilityKeyword = true;
                break;
            }
        }
        
        // Check for resource/staff keywords or if message mentions a specific name
        $hasResourceKeyword = false;
        foreach ($resourceKeywords as $keyword) {
            if (strpos($message, $keyword) !== false) {
                $hasResourceKeyword = true;
                break;
            }
        }
        
        // If message has time indicator + (availability keyword or resource keyword)
        // Or if it explicitly asks about someone's availability
        return ($hasTimeIndicator && ($hasAvailabilityKeyword || $hasResourceKeyword)) || 
               (preg_match('/(is|are|will|can|could)\s+\w+\s+be\s+available/i', $message));
    }
    
    /**
     * Generate a response specifically for availability questions
     * 
     * @param string $message The customer message
     * @param array $context The business context including resources and availability
     * @return string The AI-generated response
     */
    private function generateAvailabilityResponse(string $message, array $context): string
    {
        // Extract time and date information from the message
        $time = $this->extractTime($message);
        $date = $this->extractDate($message);
        
        // Use resource_availability for accurate staff bookings
        $resources = $context['resource_availability'] ?? [];
        $businessName = $context['business']['name'] ?? 'our business';
        $brandVoice = $context['business']['brand_voice'] ?? 'friendly';
        
        // Format resource availability info for the prompt
        $resourcesInfo = '';
        if (!empty($resources)) {
            $resourcesInfo = "Staff/resource availability:\n";
            foreach ($resources as $resource) {
                $name = $resource['name'] ?? 'Unknown';
                $type = $resource['type'] ?? 'staff';
                $services = isset($resource['services_offered']) ? implode(', ', $resource['services_offered']) : '';
                $bookedSlots = $resource['booked_slots'] ?? [];
                $bookingsText = '';
                if (!empty($bookedSlots)) {
                    $bookingsText = "  Booked slots:";
                    foreach ($bookedSlots as $slot) {
                        $bookingsText .= "\n    - " . ($slot['date'] ?? '?') . " from " . ($slot['start'] ?? '?') . " to " . ($slot['end'] ?? '?') . " (" . ($slot['service'] ?? 'unknown service') . ")";
                    }
                } else {
                    $bookingsText = "  No bookings.";
                }
                $resourcesInfo .= "- {$name} [{$type}] | Services: {$services}\n{$bookingsText}\n";
            }
        }
        
    // Build the prompt
    $prompt = "Answer a customer question about staff/resource availability at {$businessName}.
Use a {$brandVoice} tone in your response.

BUSINESS CONTEXT:
{$resourcesInfo}

CUSTOMER QUESTION:
\"{$message}\"

TIME MENTIONED: " . ($time ?? 'Not specified') . "
DATE MENTIONED: " . ($date ?? 'Not specified') . "

INSTRUCTIONS FOR CHECKING AVAILABILITY:
1. Review the 'booked slots' for each staff/resource above to determine if they are available at the requested date and time.
2. If a staff/resource has a booking that overlaps with the requested time, they are NOT available.
3. If there is no overlap, or no bookings, they ARE available.
4. Ensure the requested time is within business hours: " . json_encode($context['business']['business_hours'] ?? []) . ".
5. Be clear and confident in your answer. Only express uncertainty if the requested date/time is not provided or is outside the data shown.
6. Keep your response under 100 words, conversational and helpful.

YOUR RESPONSE:";

        // Get response from AI
        $response = $this->sendPrompt($prompt);
        
        // Fallback response if AI fails
        if (!$response) {
            return "I'd be happy to check availability for you. Could you please contact us directly at our phone number or through our booking system for the most up-to-date information? Thank you for your interest in our services!";
        }
        
        return $response;
    }
}
