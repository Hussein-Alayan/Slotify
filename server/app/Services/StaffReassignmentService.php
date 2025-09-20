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

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Mark a staff member as absent and reassign their bookings
     */
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

    /**
     * Mark a staff member as present and available again
     */
    public function markStaffPresent(Resource $staff): void
    {
        $staff->markPresent();
    }

    /**
     * Get bookings affected by staff absence
     */
    protected function getAffectedBookings(Resource $staff, Carbon $startDate, Carbon $endDate): Collection
    {
        return Booking::where('resource_id', $staff->id)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('booking_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                      ->orWhere(function ($subQuery) use ($startDate, $endDate) {
                          $subQuery->where('booking_date', '>=', $startDate->format('Y-m-d'))
                                   ->where('booking_date', '<=', $endDate->format('Y-m-d'));
                      });
            })
            ->with(['service', 'client'])
            ->get();
    }

    /**
     * Attempt to reassign multiple bookings
     */
    protected function reassignBookings(Collection $bookings): array
    {
        $successfulReassignments = [];
        $failedReassignments = [];
        $conflicts = [];

        foreach ($bookings as $booking) {
            try {
                $reassignmentResult = $this->reassignSingleBooking($booking);
                
                if ($reassignmentResult['success']) {
                    $successfulReassignments[] = [
                        'booking' => $booking,
                        'new_staff' => $reassignmentResult['new_staff']
                    ];
                } else {
                    $conflicts[] = [
                        'booking' => $booking,
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

    /**
     * Attempt to reassign a single booking
     */
    protected function reassignSingleBooking(Booking $booking): array
    {
        DB::beginTransaction();

        try {
            // Get available staff for this service at this time
            $availableStaff = $this->getAvailableStaff(
                $booking->service,
                $booking->booking_date,
                $booking->start_time,
                $booking->end_time,
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

            // Update the booking
            $booking->update(['resource_id' => $newStaff->id]);

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

    /**
     * Get available staff for a service at a specific time
     */
    protected function getAvailableStaff($service, string $date, string $startTime, string $endTime, ?int $excludeStaffId = null): Collection
    {
        $query = Resource::whereHas('services', function ($query) use ($service) {
            $query->where('services.id', $service->id);
        })
        ->where('is_absent', false)
        ->whereDoesntHave('bookings', function ($query) use ($date, $startTime, $endTime) {
            $query->where('booking_date', $date)
                  ->where('status', '!=', 'cancelled')
                  ->where(function ($timeQuery) use ($startTime, $endTime) {
                      $timeQuery->whereBetween('start_time', [$startTime, $endTime])
                                ->orWhereBetween('end_time', [$startTime, $endTime])
                                ->orWhere(function ($overlapQuery) use ($startTime, $endTime) {
                                    $overlapQuery->where('start_time', '<=', $startTime)
                                                 ->where('end_time', '>=', $endTime);
                                });
                  });
        });

        if ($excludeStaffId) {
            $query->where('id', '!=', $excludeStaffId);
        }

        return $query->get();
    }

    /**
     * Get summary of staff absence impact
     */
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
            'bookings_by_date' => $affectedBookings->groupBy('booking_date')->map->count()
        ];

        return $summary;
    }

    /**
     * Check if a booking can be reassigned
     */
    public function canBookingBeReassigned(Booking $booking): bool
    {
        $availableStaff = $this->getAvailableStaff(
            $booking->service,
            $booking->booking_date,
            $booking->start_time,
            $booking->end_time,
            $booking->resource_id
        );

        return $availableStaff->isNotEmpty();
    }
}