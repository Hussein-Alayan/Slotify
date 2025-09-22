<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Requests\CheckAvailabilityRequest;
use App\Http\Resources\BookingResource;
use App\Services\BookingService;
use App\Services\BusinessContextService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    use ApiResponseTrait;

    protected $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    // Create a new booking
    public function store(CreateBookingRequest $request)
    {
        try {
            $booking = $this->bookingService->createBooking($request->validated());
            return $this->successResponse(new BookingResource($booking), 201);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    // Get booking details
    public function show($bookingId)
    {
        $booking = $this->bookingService->getBooking($bookingId);
        return $this->successResponse(new BookingResource($booking));
    }
    
    // Check if a resource is available at a specific time
    public function checkResourceAvailability(Request $request)
    {
        try {
            $validated = $request->validate([
                'resource_id' => 'required|exists:resources,id',
                'date' => 'required|date_format:Y-m-d',
                'time' => 'required|date_format:H:i',
                'duration_minutes' => 'nullable|integer|min:5|max:480'
            ]);
            
            $result = app(BusinessContextService::class)->isResourceAvailable(
                $validated['resource_id'],
                $validated['date'], 
                $validated['time'],
                $validated['duration_minutes'] ?? 30
            );
            
            return $this->successResponse($result);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    // Update booking
    public function update(UpdateBookingRequest $request, $bookingId)
    {
        try {
            $booking = $this->bookingService->updateBooking($bookingId, $request->validated());
            return $this->successResponse(new BookingResource($booking));
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    // Cancel booking
    public function destroy($bookingId)
    {
        $this->bookingService->cancelBooking($bookingId);
        return $this->successResponse(['message' => 'Booking cancelled successfully']);
    }

    // Check availability for a business
    public function checkAvailability(CheckAvailabilityRequest $request, $businessId)
    {
        try {
            $availability = $this->bookingService->checkAvailability(
                $businessId,
                $request->validated()['date'],
                $request->validated()['service_id'] ?? null
            );
            return $this->successResponse(['availability' => $availability]);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    // Get bookings for a business
    public function getBusinessBookings($businessId)
    {
        $bookings = $this->bookingService->getBusinessBookings($businessId);
        return $this->successResponse(BookingResource::collection($bookings));
    }

    // Get bookings for a client
    public function getClientBookings($clientId)
    {
        $bookings = $this->bookingService->getClientBookings($clientId);
        return $this->successResponse(BookingResource::collection($bookings));
    }

    // Cancel next upcoming booking for a client
    public function cancelClientNextBooking($clientId)
    {
        $cancelledBooking = $this->bookingService->cancelNextUpcomingBooking($clientId, 'Cancelled via voice request');
        
        if ($cancelledBooking) {
            return $this->successResponse([
                'message' => 'Next upcoming booking cancelled successfully',
                'booking' => new BookingResource($cancelledBooking)
            ]);
        }
        
        return $this->errorResponse('No upcoming bookings found to cancel', 404);
    }

    // Get bookings for a business by date
    public function getBusinessBookingsByDate($businessId)
    {
        $date = request()->query('date');
        $bookings = $this->bookingService->getBusinessBookingsByDate($businessId, $date);
        return $this->successResponse(BookingResource::collection($bookings));
    }
}
