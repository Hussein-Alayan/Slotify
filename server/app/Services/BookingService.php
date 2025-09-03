<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Business;
use App\Models\Client;
use App\Models\Service;
use App\Models\BookingRule;
use Carbon\Carbon;

class BookingService
{
    // Create a new booking
    public function createBooking(array $data): Booking
    {
        // Validate that client belongs to business
        $client = Client::where('id', $data['client_id'])
            ->where('business_id', $data['business_id'])
            ->firstOrFail();

        // Validate that service belongs to business
        $service = Service::where('id', $data['service_id'])
            ->where('business_id', $data['business_id'])
            ->firstOrFail();

        // Check availability
        $this->validateAvailability(
            $data['business_id'],
            $data['start_time'],
            $data['end_time'],
            $data['service_id'],
            $data['resource_id'] ?? null
        );

        return Booking::create([
            'business_id' => $data['business_id'],
            'client_id' => $data['client_id'],
            'service_id' => $data['service_id'],
            'resource_id' => $data['resource_id'] ?? null,
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'status' => 'confirmed',
        ]);
    }

    // Get booking by ID
    public function getBooking(int $bookingId): Booking
    {
        return Booking::with(['business', 'client', 'service', 'resource'])->findOrFail($bookingId);
    }

    // Update booking
    public function updateBooking(int $bookingId, array $data): Booking
    {
        $booking = Booking::findOrFail($bookingId);

        // If time is being changed, validate availability
        if (isset($data['start_time']) || isset($data['end_time'])) {
            $this->validateAvailability(
                $booking->business_id,
                $data['start_time'] ?? $booking->start_time,
                $data['end_time'] ?? $booking->end_time,
                $data['service_id'] ?? $booking->service_id,
                $data['resource_id'] ?? $booking->resource_id,
                $bookingId // exclude current booking from conflict check
            );
        }

        $booking->update($data);
        return $booking->fresh(['business', 'client', 'service', 'resource']);
    }

    // Cancel booking
    public function cancelBooking(int $bookingId): bool
    {
        $booking = Booking::findOrFail($bookingId);
        return $booking->update(['status' => 'cancelled']);
    }

    // Check availability for a specific date
    public function checkAvailability(int $businessId, string $date, ?int $serviceId = null): array
    {
        $business = Business::findOrFail($businessId);
        $bookingRules = $business->bookingRules;
        
        if (!$bookingRules) {
            throw new \Exception('Business hours not configured');
        }

        // Get business hours for the day
        $dayOfWeek = Carbon::parse($date)->format('l'); // Monday, Tuesday, etc.
        $workingHours = $this->getWorkingHoursForDay($bookingRules, $dayOfWeek);
        
        if (!$workingHours) {
            return []; // Business closed on this day
        }

        // Get existing bookings for the date
        $existingBookings = Booking::where('business_id', $businessId)
            ->whereDate('start_time', $date)
            ->where('status', '!=', 'cancelled')
            ->orderBy('start_time')
            ->get();

        // Generate available time slots
        return $this->generateAvailableSlots(
            $date,
            $workingHours,
            $existingBookings,
            $serviceId
        );
    }

    // Get bookings for a business
    public function getBusinessBookings(int $businessId): \Illuminate\Database\Eloquent\Collection
    {
        return Booking::where('business_id', $businessId)
            ->with(['client', 'service', 'resource'])
            ->orderBy('start_time')
            ->get();
    }

    // Get bookings for a client
    public function getClientBookings(int $clientId): \Illuminate\Database\Eloquent\Collection
    {
        return Booking::where('client_id', $clientId)
            ->with(['business', 'service', 'resource'])
            ->orderBy('start_time')
            ->get();
    }

    // Private method to validate availability
    private function validateAvailability(
        int $businessId,
        string $startTime,
        string $endTime,
        int $serviceId,
        ?int $resourceId = null,
        ?int $excludeBookingId = null
    ): void {
        // Check for booking conflicts
        $conflictQuery = Booking::where('business_id', $businessId)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<=', $startTime)
                          ->where('end_time', '>=', $endTime);
                    });
            });

        if ($resourceId) {
            $conflictQuery->where('resource_id', $resourceId);
        }

        if ($excludeBookingId) {
            $conflictQuery->where('id', '!=', $excludeBookingId);
        }

        if ($conflictQuery->exists()) {
            throw new \Exception('Time slot is not available');
        }

        // Check business hours
        $business = Business::findOrFail($businessId);
        $this->validateBusinessHours($business, $startTime, $endTime);
    }

    // Private method to validate business hours
    private function validateBusinessHours(Business $business, string $startTime, string $endTime): void
    {
        $bookingRules = $business->bookingRules;
        if (!$bookingRules) {
            throw new \Exception('Business hours not configured');
        }

        $dayOfWeek = Carbon::parse($startTime)->format('l');
        $workingHours = $this->getWorkingHoursForDay($bookingRules, $dayOfWeek);
        
        if (!$workingHours) {
            throw new \Exception('Business is closed on ' . $dayOfWeek);
        }

        $requestStart = Carbon::parse($startTime)->format('H:i');
        $requestEnd = Carbon::parse($endTime)->format('H:i');
        
        if ($requestStart < $workingHours['start'] || $requestEnd > $workingHours['end']) {
            throw new \Exception('Booking time is outside business hours');
        }
    }

    // Private method to get working hours for a specific day
    private function getWorkingHoursForDay(BookingRule $bookingRules, string $dayOfWeek): ?array
    {
        // This would depend on how you store working hours in booking_rules
        // For now, returning a placeholder - you'll need to implement based on your schema
        $workingHours = [
            'Monday' => ['start' => '09:00', 'end' => '17:00'],
            'Tuesday' => ['start' => '09:00', 'end' => '17:00'],
            'Wednesday' => ['start' => '09:00', 'end' => '17:00'],
            'Thursday' => ['start' => '09:00', 'end' => '17:00'],
            'Friday' => ['start' => '09:00', 'end' => '17:00'],
            'Saturday' => null,
            'Sunday' => null,
        ];

        return $workingHours[$dayOfWeek] ?? null;
    }

    // Private method to generate available time slots
    private function generateAvailableSlots(
        string $date,
        array $workingHours,
        $existingBookings,
        ?int $serviceId = null
    ): array {
        $slots = [];
        $slotDuration = 60; // 1 hour slots by default
        
        $start = Carbon::parse($date . ' ' . $workingHours['start']);
        $end = Carbon::parse($date . ' ' . $workingHours['end']);
        
        while ($start->addMinutes($slotDuration) <= $end) {
            $slotStart = $start->copy()->subMinutes($slotDuration);
            $slotEnd = $start->copy();
            
            // Check if this slot conflicts with existing bookings
            $hasConflict = $existingBookings->contains(function ($booking) use ($slotStart, $slotEnd) {
                return $booking->start_time < $slotEnd && $booking->end_time > $slotStart;
            });
            
            if (!$hasConflict) {
                $slots[] = [
                    'start_time' => $slotStart->toISOString(),
                    'end_time' => $slotEnd->toISOString(),
                    'available' => true,
                ];
            }
        }
        
        return $slots;
    }
}
