<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class N8nNotificationService
{
    protected string $webhookUrl;

    public function __construct()
    {
        $this->webhookUrl = config('services.n8n.webhook_url', 'http://localhost:5678/webhook');
    }

    /**
     * Send booking cancellation notification to n8n
     */
    public function sendBookingCancellationNotification(Booking $booking, string $reason): bool
    {
        try {
            $payload = $this->buildCancellationPayload($booking, $reason);
            
            $response = Http::timeout(10)->post($this->webhookUrl . '/booking-cancelled', $payload);
            
            if ($response->successful()) {
                Log::info('N8N cancellation notification sent', [
                    'booking_id' => $booking->id,
                    'client_phone' => $booking->client->phone
                ]);
                return true;
            } else {
                Log::error('N8N cancellation notification failed', [
                    'booking_id' => $booking->id,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                return false;
            }
        } catch (Exception $e) {
            Log::error('N8N cancellation notification error', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Send booking reassignment notification to n8n
     */
    public function sendBookingReassignmentNotification(Booking $booking, $newStaff): bool
    {
        try {
            $payload = $this->buildReassignmentPayload($booking, $newStaff);
            
            $response = Http::timeout(10)->post($this->webhookUrl . '/booking-reassigned', $payload);
            
            if ($response->successful()) {
                Log::info('N8N reassignment notification sent', [
                    'booking_id' => $booking->id,
                    'new_staff' => $newStaff->name
                ]);
                return true;
            }
            
            return false;
        } catch (Exception $e) {
            Log::error('N8N reassignment notification error', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Build payload for booking cancellation
     */
    protected function buildCancellationPayload(Booking $booking, string $reason): array
    {
        return [
            'event_type' => 'booking_cancelled',
            'booking' => [
                'id' => $booking->id,
                'start_time' => $booking->start_time->format('Y-m-d H:i:s'),
                'end_time' => $booking->end_time->format('Y-m-d H:i:s'),
                'cancellation_reason' => $reason,
            ],
            'client' => [
                'name' => $booking->client->name,
                'phone' => $booking->client->phone,
                'email' => $booking->client->email,
            ],
            'service' => [
                'name' => $booking->service->name,
                'price' => $booking->service->price,
            ],
            'business' => [
                'name' => $booking->business->name ?? 'Slotify Business',
            ],
            'message_template' => 'cancellation',
            'timestamp' => now()->toISOString()
        ];
    }

    /**
     * Build payload for booking reassignment
     */
    protected function buildReassignmentPayload(Booking $booking, $newStaff): array
    {
        return [
            'event_type' => 'booking_reassigned',
            'booking' => [
                'id' => $booking->id,
                'start_time' => $booking->start_time->format('Y-m-d H:i:s'),
                'end_time' => $booking->end_time->format('Y-m-d H:i:s'),
            ],
            'client' => [
                'name' => $booking->client->name,
                'phone' => $booking->client->phone,
                'email' => $booking->client->email,
            ],
            'service' => [
                'name' => $booking->service->name,
                'price' => $booking->service->price,
            ],
            'new_staff' => [
                'name' => $newStaff->name,
                'role' => $newStaff->role,
            ],
            'business' => [
                'name' => $booking->business->name ?? 'Slotify Business',
            ],
            'message_template' => 'reassignment',
            'timestamp' => now()->toISOString()
        ];
    }
}