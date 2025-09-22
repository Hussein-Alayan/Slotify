<?php

namespace App\Services;

use App\Models\Resource;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Exception;

class StaffReassignmentService
{
    protected BookingService $bookingService;
    protected N8nNotificationService $n8nService;

    public function __construct(BookingService $bookingService, N8nNotificationService $n8nService)
    {
        $this->bookingService = $bookingService;
        $this->n8nService = $n8nService;
    }

    // Mark a staff member as absent and reassign their bookings
    public function markStaffAbsent(Resource $staff, string $reason, ?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now();
        $endDate = $endDate ?? Carbon::now()->addDays(1);

        // Mark staff as absent
        $staff->markAbsent($reason, $startDate, $endDate);

        // Get affected bookings
        $affectedBookings = $this->getAffectedBookings($staff, $startDate, $endDate);

        // Attempt to reassign bookings
        $reassignmentResults = $this->reassignBookings($affectedBookings);

        return [
            'staff' => $staff,
            'affected_bookings_count' => $affectedBookings->count(),
            'successfully_reassigned' => $reassignmentResults['success'],
            'failed_reassignments' => $reassignmentResults['failed'],
            'conflicts' => $reassignmentResults['conflicts']
        ];
    }

    // Mark a staff member as present and available again
    public function markStaffPresent(Resource $staff): void
    {
        $staff->markPresent();
    }

    // Get bookings affected by staff absence
    protected function getAffectedBookings(Resource $staff, Carbon $startDate, Carbon $endDate): Collection
    {
        return Booking::where('resource_id', $staff->id)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_time', [
                    $startDate->startOfDay()->toDateTimeString(),
                    $endDate->endOfDay()->toDateTimeString()
                ]);
            })
            ->with(['service', 'client'])
            ->get();
    }

    // Attempt to reassign multiple bookings
    protected function reassignBookings(Collection $bookings): array
    {
        $successfulReassignments = [];
        $failedReassignments = [];
        $conflicts = [];

        foreach ($bookings as $booking) {
            try {
                $reassignmentResult = $this->reassignSingleBooking($booking);
                
                if ($reassignmentResult['success']) {
                    // Update booking with new staff - keep status as 'confirmed' since it's still a valid booking
                    $booking->update([
                        'cancellation_reason' => 'Reassigned due to staff absence'
                    ]);
                    
                    // Send reassignment notification
                    $this->n8nService->sendBookingReassignmentNotification(
                        $booking->fresh()->load(['client', 'service', 'business']), 
                        $reassignmentResult['new_staff']
                    );
                    
                    $successfulReassignments[] = [
                        'booking' => $booking->fresh(),
                        'new_staff' => $reassignmentResult['new_staff']
                    ];
                } else {
                    // Mark booking as cancelled when it cannot be reassigned
                    $booking->update([
                        'status' => 'cancelled',
                        'cancellation_reason' => 'Staff unavailable - ' . $reassignmentResult['reason'],
                        'cancelled_at' => now()
                    ]);
                    
                    // Send cancellation notification
                    $this->n8nService->sendBookingCancellationNotification(
                        $booking->fresh()->load(['client', 'service', 'business']), 
                        'Staff unavailable - ' . $reassignmentResult['reason']
                    );
                    
                    $conflicts[] = [
                        'booking' => $booking->fresh(),
                        'reason' => $reassignmentResult['reason']
                    ];
                }
            } catch (Exception $e) {
                $failedReassignments[] = [
                    'booking' => $booking,
                    'error' => $e->getMessage()
                ];
            }
        }

        return [
            'success' => $successfulReassignments,
            'failed' => $failedReassignments,
            'conflicts' => $conflicts
        ];
    }

    // Attempt to reassign a single booking
    protected function reassignSingleBooking(Booking $booking): array
    {
        DB::beginTransaction();

        try {
            // Get available staff for this service at this time
            $availableStaff = $this->getAvailableStaff(
                $booking->service,
                $booking->start_time->format('Y-m-d'),
                $booking->start_time->format('H:i:s'),
                $booking->end_time->format('H:i:s'),
                $booking->resource_id // Exclude the absent staff
            );

            if ($availableStaff->isEmpty()) {
                DB::rollback();
                return [
                    'success' => false,
                    'reason' => 'No available staff found for this service and time slot'
                ];
            }

            // Use simple assignment logic - pick the first available staff
            $newStaff = $availableStaff->first();

            // Update the booking with new staff and add a note about reassignment
            $booking->update([
                'resource_id' => $newStaff->id,
                'cancellation_reason' => 'Reassigned due to staff absence'
            ]);

            DB::commit();

            return [
                'success' => true,
                'new_staff' => $newStaff
            ];

        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    // Get available staff for a service at a specific time
    protected function getAvailableStaff($service, string $date, string $startTime, string $endTime, ?int $excludeStaffId = null): Collection
    {
        // Convert date and time strings to proper datetime strings
        $requestedStart = Carbon::parse($date . ' ' . $startTime);
        $requestedEnd = Carbon::parse($date . ' ' . $endTime);

        $query = Resource::whereHas('services', function ($query) use ($service) {
            $query->where('services.id', $service->id);
        })
        ->where('is_absent', false)
        ->whereDoesntHave('bookings', function ($query) use ($requestedStart, $requestedEnd) {
            $query->where('status', '!=', 'cancelled')
                  ->where(function ($timeQuery) use ($requestedStart, $requestedEnd) {
                      // Check for time overlap: bookings that would conflict
                      $timeQuery->where('start_time', '<', $requestedEnd)
                                ->where('end_time', '>', $requestedStart);
                  });
        });

        if ($excludeStaffId) {
            $query->where('id', '!=', $excludeStaffId);
        }

        return $query->get();
    }

    // Get summary of staff absence impact
    public function getAbsenceImpactSummary(Resource $staff, ?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now();
        $endDate = $endDate ?? ($staff->absence_end ?? Carbon::now()->addDays(1));

        $affectedBookings = $this->getAffectedBookings($staff, $startDate, $endDate);
        
        $summary = [
            'staff_name' => $staff->name,
            'absence_period' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d')
            ],
            'total_affected_bookings' => $affectedBookings->count(),
            'services_affected' => $affectedBookings->pluck('service.name')->unique()->values(),
            'clients_affected' => $affectedBookings->pluck('client.name')->unique()->values(),
            'bookings_by_date' => $affectedBookings->groupBy(function ($booking) {
                return $booking->start_time->format('Y-m-d');
            })->map->count()
        ];

        return $summary;
    }

    // Check if a booking can be reassigned
    public function canBookingBeReassigned(Booking $booking): bool
    {
        $availableStaff = $this->getAvailableStaff(
            $booking->service,
            $booking->start_time->format('Y-m-d'),
            $booking->start_time->format('H:i:s'),
            $booking->end_time->format('H:i:s'),
            $booking->resource_id
        );

        return $availableStaff->isNotEmpty();
    }
}