<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Requests\CheckAvailabilityRequest;
use App\Http\Resources\BookingResource;
use App\Services\BookingService;
use App\Traits\ApiResponseTrait;

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
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create booking: ' . $e->getMessage(), 400);
        }
    }

    // Get booking details
    public function show($bookingId)
    {
        try {
            $booking = $this->bookingService->getBooking($bookingId);
            return $this->successResponse(new BookingResource($booking));
        } catch (\Exception $e) {
            return $this->errorResponse('Booking not found', 404);
        }
    }

    // Update booking
    public function update(UpdateBookingRequest $request, $bookingId)
    {
        try {
            $booking = $this->bookingService->updateBooking($bookingId, $request->validated());
            return $this->successResponse(new BookingResource($booking));
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update booking: ' . $e->getMessage(), 400);
        }
    }

    // Cancel booking
    public function destroy($bookingId)
    {
        try {
            $this->bookingService->cancelBooking($bookingId);
            return $this->successResponse(['message' => 'Booking cancelled successfully']);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to cancel booking: ' . $e->getMessage(), 400);
        }
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
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to check availability: ' . $e->getMessage(), 400);
        }
    }

    // Get bookings for a business
    public function getBusinessBookings($businessId)
    {
        try {
            $bookings = $this->bookingService->getBusinessBookings($businessId);
            return $this->successResponse(BookingResource::collection($bookings));
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to get bookings: ' . $e->getMessage(), 400);
        }
    }

    // Get bookings for a client
    public function getClientBookings($clientId)
    {
        try {
            $bookings = $this->bookingService->getClientBookings($clientId);
            return $this->successResponse(BookingResource::collection($bookings));
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to get bookings: ' . $e->getMessage(), 400);
        }
    }
}
