<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProcessAIMessageRequest;
use App\Services\ConversationService;
use App\Services\BookingService;
use App\Services\AIService;
use App\Traits\ApiResponseTrait;
use App\Models\Conversation;
use Carbon\Carbon;

class AIBookingController extends Controller
{
    use ApiResponseTrait;

    protected $conversationService;
    protected $bookingService;
    protected $aiService;

    public function __construct(
        ConversationService $conversationService,
        BookingService $bookingService,
        AIService $aiService
    ) {
        $this->conversationService = $conversationService;
        $this->bookingService = $bookingService;
        $this->aiService = $aiService;
    }

    /**
     * Process AI message and handle booking flow
     */
    public function processMessage(ProcessAIMessageRequest $request)
    {
        $flowSteps = [];
        $conversationId = $request->input('conversation_id');
        $clientId = $request->input('client_id');
        $userMessage = $request->input('message');

        try {
            // Get conversation to find business_id
            $conversation = Conversation::findOrFail($conversationId);
            $businessId = $conversation->business_id;

            // Step 1: Store user message
            $userMessageRecord = $this->conversationService->sendMessage(
                $conversationId,
                $clientId,
                $businessId,
                'user',
                $userMessage
            );
            $flowSteps[] = "✅ User message stored";

            // Step 2: AI Analysis
            $aiAnalysis = $this->aiService->analyzeBookingIntent($userMessage);
            $flowSteps[] = "✅ AI intent analysis completed";

            $bookingCreated = false;
            $booking = null;
            $aiResponseText = "";

            // Step 3: Process booking if intent detected
            if ($aiAnalysis['intent'] === 'booking' && $aiAnalysis['confidence'] > 0.5) {
                $flowSteps[] = "✅ Booking intent detected (confidence: {$aiAnalysis['confidence']})";

                try {
                    // Use forced booking data if provided, otherwise use AI extracted data + defaults
                    $bookingData = $this->prepareBookingData($request, $aiAnalysis, $businessId, $clientId);
                    
                    // Create the booking
                    $booking = $this->bookingService->createBooking($bookingData);
                    $bookingCreated = true;
                    $flowSteps[] = "✅ Booking created successfully";

                    // Generate AI success response
                    $aiResponseText = $this->aiService->generateBookingResponse(true, [
                        'date' => $bookingData['start_time'],
                        'time' => $bookingData['start_time'],
                        'service' => $booking->service->name ?? 'appointment'
                    ]);

                } catch (\Exception $e) {
                    $flowSteps[] = "❌ Booking failed: " . $e->getMessage();
                    
                    // Generate AI failure response
                    $aiResponseText = $this->aiService->generateBookingResponse(false, [
                        'error' => $e->getMessage()
                    ]);
                }
            } else {
                $flowSteps[] = "ℹ️ No booking intent detected or low confidence";
                
                // Generate general AI response
                $aiResponseText = "Thank you for your message! How can I help you with booking an appointment today?";
            }

            // Step 4: Store AI response
            $aiMessageRecord = $this->conversationService->sendMessage(
                $conversationId,
                $clientId,
                $businessId,
                'ai',
                $aiResponseText
            );
            $flowSteps[] = "✅ AI response stored";

            // Step 5: Prepare response
            return $this->successResponse([
                'message_processed' => true,
                'flow_steps' => $flowSteps,
                'ai_analysis' => $aiAnalysis,
                'booking_created' => $bookingCreated,
                'booking' => $booking ? [
                    'id' => $booking->id,
                    'start_time' => $booking->start_time,
                    'end_time' => $booking->end_time,
                    'status' => $booking->status,
                    'service' => $booking->service->name ?? null,
                ] : null,
                'conversation_summary' => [
                    'conversation_id' => $conversationId,
                    'total_messages' => 2, // user + ai
                    'last_user_message' => $userMessage,
                    'ai_response' => $aiResponseText,
                ],
                'processing_metadata' => [
                    'timestamp' => now()->toISOString(),
                    'ai_model' => 'mistral',
                    'booking_service_used' => $bookingCreated,
                ]
            ]);

        } catch (\Exception $e) {
            $flowSteps[] = "❌ Flow failed: " . $e->getMessage();
            
            return $this->errorResponse([
                'message' => 'Message processing failed',
                'error' => $e->getMessage(),
                'flow_steps' => $flowSteps,
            ], 500);
        }
    }

    /**
     * Prepare booking data from AI analysis and request
     */
    private function prepareBookingData($request, $aiAnalysis, $businessId, $clientId): array
    {
        // Check if forced booking data is provided (for testing)
        $forcedData = $request->input('force_booking_data', []);
        
        if (!empty($forcedData)) {
            $serviceId = $forcedData['service_id'] ?? 1; // Default to first service
            $date = $forcedData['date'] ?? 'tomorrow';
            $time = $forcedData['time'] ?? '15:00';
        } else {
            // Use AI extracted data with defaults
            $serviceId = 1; // Default to first service (we'll improve this later)
            $date = $aiAnalysis['extracted_data']['date'] ?? 'tomorrow';
            $time = $aiAnalysis['extracted_data']['time'] ?? '15:00';
        }

        // Convert date and time to proper datetime
        $startDateTime = $this->parseDateTime($date, $time);
        $endDateTime = $startDateTime->copy()->addHour(); // Default 1-hour appointment

        return [
            'business_id' => $businessId,
            'client_id' => $clientId,
            'service_id' => $serviceId,
            'start_time' => $startDateTime->toDateTimeString(),
            'end_time' => $endDateTime->toDateTimeString(),
        ];
    }

    /**
     * Parse date and time strings into Carbon datetime
     */
    private function parseDateTime($date, $time): Carbon
    {
        $baseDate = Carbon::today();
        
        // Handle date
        if ($date === 'tomorrow') {
            $baseDate = Carbon::tomorrow();
        } elseif ($date === 'today') {
            $baseDate = Carbon::today();
        } else {
            try {
                $baseDate = Carbon::parse($date);
            } catch (\Exception $e) {
                $baseDate = Carbon::tomorrow(); // Default fallback
            }
        }

        // Handle time
        try {
            $timeString = $time;
            // Convert "3pm" to "15:00" format
            if (preg_match('/(\d{1,2})\s*(am|pm)/i', $time, $matches)) {
                $hour = (int)$matches[1];
                $period = strtolower($matches[2]);
                
                if ($period === 'pm' && $hour !== 12) {
                    $hour += 12;
                } elseif ($period === 'am' && $hour === 12) {
                    $hour = 0;
                }
                
                $timeString = sprintf('%02d:00', $hour);
            }
            
            $baseDate->setTimeFromTimeString($timeString);
        } catch (\Exception $e) {
            $baseDate->setTime(15, 0); // Default to 3 PM
        }

        return $baseDate;
    }
}
