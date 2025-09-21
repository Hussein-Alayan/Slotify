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

        // Auto-assign staff if resource_id is not provided
        if (empty($data['resource_id'])) {
            // Get all staff who can perform this service
            $staff = $service->resources()->where('type', 'staff')->get();
            $start = Carbon::parse($data['start_time']);
            $end = Carbon::parse($data['end_time']);
            $assigned = false;
            foreach ($staff as $member) {
                // Check for overlapping bookings for this staff
                $hasConflict = Booking::where('resource_id', $member->id)
                    ->where('status', 'confirmed')
                    ->where(function($q) use ($start, $end) {
                        $q->where('start_time', '<', $end)
                          ->where('end_time', '>', $start);
                    })
                    ->exists();
                if (!$hasConflict) {
                    $data['resource_id'] = $member->id;
                    $assigned = true;
                    break;
                }
            }
            if (!$assigned) {
                throw new \InvalidArgumentException('No available staff for the requested time slot.');
            }
        }

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

    // Get next upcoming booking for a client
    public function getNextUpcomingBooking(int $clientId): ?Booking
    {
        return Booking::where('client_id', $clientId)
            ->upcoming()
            ->orderBy('start_time')
            ->first();
    }

    // Cancel next upcoming booking for a client
    public function cancelNextUpcomingBooking(int $clientId, ?string $reason = null): ?Booking
    {
        $booking = $this->getNextUpcomingBooking($clientId);
        if ($booking && $booking->canBeCancelled()) {
            $booking->cancelBooking($reason);
            return $booking->fresh(['business', 'service', 'resource']);
        }
        return null;
    }

    // Check availability for a specific date
    public function checkAvailability(int $businessId, string $date, ?int $serviceId = null): array
    {
        $business = Business::findOrFail($businessId);
        $bookingRules = $business->bookingRules;
        
        if (!$bookingRules) {
            throw new \InvalidArgumentException('Business hours not configured');
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

    // Get bookings for a business by date
    public function getBusinessBookingsByDate(int $businessId, $date)
    {
        return Booking::where('business_id', $businessId)
            ->whereDate('start_time', $date)
            ->with(['client', 'service', 'resource'])
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
        // Check for booking conflicts - improved logic
        $conflictQuery = Booking::where('business_id', $businessId)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($startTime, $endTime) {
                // Check for overlapping bookings
                $query->where(function ($q) use ($startTime, $endTime) {
                    // New booking starts before existing ends AND new booking ends after existing starts
                    $q->where('start_time', '<', $endTime)
                      ->where('end_time', '>', $startTime);
                });
            });

        if ($resourceId) {
            $conflictQuery->where('resource_id', $resourceId);
        }

        if ($excludeBookingId) {
            $conflictQuery->where('id', '!=', $excludeBookingId);
        }

        $conflictingBooking = $conflictQuery->first();
        if ($conflictingBooking) {
            throw new \InvalidArgumentException(
                "Time slot conflicts with existing booking #{$conflictingBooking->id} " .
                "from {$conflictingBooking->start_time->format('H:i')} to {$conflictingBooking->end_time->format('H:i')}"
            );
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
            // Try to use business_hours from business table as fallback
            if (!$business->business_hours) {
                throw new \InvalidArgumentException('Business hours not configured');
            }
            
            // Create a temporary booking rule object for compatibility
            $bookingRules = new BookingRule();
            $bookingRules->hours_of_operation = $business->business_hours;
            $bookingRules->setRelation('business', $business);
        }

        $dayOfWeek = Carbon::parse($startTime)->format('l'); // Monday, Tuesday, etc.
        $workingHours = $this->getWorkingHoursForDay($bookingRules, $dayOfWeek);
        
        if (!$workingHours) {
            throw new \InvalidArgumentException("Business is closed on {$dayOfWeek}");
        }

        $requestStart = Carbon::parse($startTime)->format('H:i');
        $requestEnd = Carbon::parse($endTime)->format('H:i');
        
        if ($requestStart < $workingHours['start'] || $requestEnd > $workingHours['end']) {
            throw new \InvalidArgumentException(
                "Booking time ({$requestStart}-{$requestEnd}) is outside business hours " .
                "({$workingHours['start']}-{$workingHours['end']}) for {$dayOfWeek}"
            );
        }
    }

    // Private method to get working hours for a specific day
    private function getWorkingHoursForDay(BookingRule $bookingRules, string $dayOfWeek): ?array
    {
        // Get the actual business hours from the database
        $hoursOfOperation = $bookingRules->hours_of_operation;
        
        if (!$hoursOfOperation || !is_array($hoursOfOperation)) {
            // Fallback to business hours if booking rules don't have them
            $business = $bookingRules->business;
            $hoursOfOperation = $business->business_hours ?? [];
        }
        
        // Map day names to the keys used in the database
        $dayMapping = [
            'Monday' => 'mon',
            'Tuesday' => 'tue', 
            'Wednesday' => 'wed',
            'Thursday' => 'thu',
            'Friday' => 'fri',
            'Saturday' => 'sat',
            'Sunday' => 'sun',
        ];
        
        $dayKey = $dayMapping[$dayOfWeek] ?? strtolower(substr($dayOfWeek, 0, 3));
        $dayHours = $hoursOfOperation[$dayKey] ?? null;
        
        // Handle different data formats
        if (!$dayHours) {
            return null; // Business closed
        }
        
        // Handle array format: ['09:00', '17:00'] or ['start' => '09:00', 'end' => '17:00']
        if (is_array($dayHours)) {
            if (isset($dayHours['closed']) && $dayHours['closed']) {
                return null; // Explicitly closed
            }
            
            if (isset($dayHours['start']) && isset($dayHours['end'])) {
                return [
                    'start' => $dayHours['start'],
                    'end' => $dayHours['end']
                ];
            }
            
            if (count($dayHours) >= 2 && is_numeric(array_keys($dayHours)[0])) {
                return [
                    'start' => $dayHours[0],
                    'end' => $dayHours[1]
                ];
            }
        }
        
        return null;
    }

    // Private method to generate available time slots
    private function generateAvailableSlots(
        string $date,
        array $workingHours,
        $existingBookings,
        ?int $serviceId = null
    ): array {
        $slots = [];
        
        // Get slot duration from service, or use business default
        if ($serviceId) {
            $service = Service::find($serviceId);
            $slotDuration = $service ? $service->duration_minutes : 60;
        } else {
            $slotDuration = 60; // Default when no service specified
        }
        
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
