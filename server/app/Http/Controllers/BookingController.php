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

    /**
     * Create a new booking
     * @see App\Http\Docs\BookingDocs for API documentation
     */
    public function store(CreateBookingRequest $request)
    {
        try {
            $booking = $this->bookingService->createBooking($request->validated());
            return $this->successResponse(new BookingResource($booking), 201);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Get booking details
     * @see App\Http\Docs\BookingDocs for API documentation
     */
    public function show($bookingId)
    {
        $booking = $this->bookingService->getBooking($bookingId);
        return $this->successResponse(new BookingResource($booking));
    }

    /**
     * Update booking
     * @see App\Http\Docs\BookingDocs for API documentation
     */
    public function update(UpdateBookingRequest $request, $bookingId)
    {
        try {
            $booking = $this->bookingService->updateBooking($bookingId, $request->validated());
            return $this->successResponse(new BookingResource($booking));
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Cancel booking
     * @see App\Http\Docs\BookingDocs for API documentation
     */
    public function destroy($bookingId)
    {
        $this->bookingService->cancelBooking($bookingId);
        return $this->successResponse(['message' => 'Booking cancelled successfully']);
    }

    /**
     * Check availability for a business
     * @see App\Http\Docs\BookingDocs for API documentation
     */
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

    /**
     * Get bookings for a business
     * @see App\Http\Docs\BookingDocs for API documentation
     */
    public function getBusinessBookings($businessId)
    {
        $bookings = $this->bookingService->getBusinessBookings($businessId);
        return $this->successResponse(BookingResource::collection($bookings));
    }

    /**
     * Get bookings for a client
     * @see App\Http\Docs\BookingDocs for API documentation
     */
    public function getClientBookings($clientId)
    {
        $bookings = $this->bookingService->getClientBookings($clientId);
        return $this->successResponse(BookingResource::collection($bookings));
    }
}
