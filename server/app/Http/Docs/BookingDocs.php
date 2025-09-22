<?php

namespace App\Http\Docs;

/**
 * @OA\Post(
 *     path="/api/v1/bookings",
 *     summary="Create a new booking",
 *     tags={"Bookings"},
 *     security={{"sanctum": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"service_id","date","time"},
 *             @OA\Property(property="service_id", type="integer", example=1),
 *             @OA\Property(property="date", type="string", format="date", example="2025-09-12"),
 *             @OA\Property(property="time", type="string", format="time", example="14:00")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Booking created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="id", type="integer"),
 *             @OA\Property(property="service_id", type="integer"),
 *             @OA\Property(property="date", type="string", format="date"),
 *             @OA\Property(property="time", type="string", format="time"),
 *             @OA\Property(property="status", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input or booking error"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/bookings/{booking}",
 *     summary="Get booking details",
 *     tags={"Bookings"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(name="booking", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Booking details returned successfully"
 *     )
 * )
 * @OA\Put(
 *     path="/api/v1/bookings/{booking}",
 *     summary="Update a booking",
 *     tags={"Bookings"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(name="booking", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="date", type="string", format="date", example="2025-09-13"),
 *             @OA\Property(property="time", type="string", format="time", example="15:00")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Booking updated successfully"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input or update error"
 *     )
 * )
 * @OA\Delete(
 *     path="/api/v1/bookings/{booking}",
 *     summary="Cancel a booking",
 *     tags={"Bookings"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(name="booking", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Booking cancelled successfully"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/availability",
 *     summary="Check business availability",
 *     tags={"Bookings"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(name="business", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Parameter(name="date", in="query", required=true, @OA\Schema(type="string", format="date")),
 *     @OA\Parameter(name="service_id", in="query", required=false, @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Availability returned successfully"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/bookings",
 *     summary="Get bookings for a business",
 *     tags={"Bookings"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(name="business", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Business bookings returned successfully"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/clients/{client}/bookings",
 *     summary="Get bookings for a client",
 *     tags={"Bookings"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(name="client", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Client bookings returned successfully"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/bookings/by-date",
 *     summary="Get business bookings filtered by date",
 *     tags={"Bookings"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(name="business", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Parameter(
 *         name="date",
 *         in="query",
 *         required=true,
 *         @OA\Schema(type="string", format="date"),
 *         description="Date to filter bookings (YYYY-MM-DD)"
 *     ),
 *     @OA\Parameter(
 *         name="status",
 *         in="query",
 *         required=false,
 *         @OA\Schema(type="string", enum={"confirmed", "completed", "cancelled"}),
 *         description="Filter by booking status"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Business bookings by date returned successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
 *             @OA\Property(property="date", type="string", format="date"),
 *             @OA\Property(property="total_bookings", type="integer", example=5)
 *         )
 *     )
 * )
 * @OA\Post(
 *     path="/api/v1/businesses/{business}/bookings",
 *     summary="Create a booking for a specific business",
 *     tags={"Bookings"},
 *     @OA\Parameter(name="business", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"service_id","client_id","date","time"},
 *             @OA\Property(property="service_id", type="integer", example=1),
 *             @OA\Property(property="client_id", type="integer", example=1),
 *             @OA\Property(property="date", type="string", format="date", example="2025-09-22"),
 *             @OA\Property(property="time", type="string", format="time", example="14:00"),
 *             @OA\Property(property="resource_id", type="integer", example=1, description="Preferred staff member"),
 *             @OA\Property(property="notes", type="string", example="Special requirements")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Business booking created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error or booking conflict"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/resources/availability",
 *     summary="Check resource availability",
 *     tags={"Bookings"},
 *     @OA\Parameter(
 *         name="resource_id",
 *         in="query",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Resource ID to check availability"
 *     ),
 *     @OA\Parameter(
 *         name="date",
 *         in="query",
 *         required=true,
 *         @OA\Schema(type="string", format="date"),
 *         description="Date to check availability"
 *     ),
 *     @OA\Parameter(
 *         name="service_id",
 *         in="query",
 *         required=false,
 *         @OA\Schema(type="integer"),
 *         description="Service ID for duration calculation"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Resource availability returned successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="resource_id", type="integer", example=1),
 *                 @OA\Property(property="date", type="string", format="date"),
 *                 @OA\Property(property="available_slots", type="array", @OA\Items(
 *                     @OA\Property(property="time", type="string", format="time"),
 *                     @OA\Property(property="duration", type="integer")
 *                 ))
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Resource not found"
 *     )
 * )
 * @OA\Delete(
 *     path="/api/v1/clients/{client}/bookings/next",
 *     summary="Cancel client's next upcoming booking",
 *     tags={"Bookings"},
 *     @OA\Parameter(name="client", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=false,
 *         @OA\JsonContent(
 *             @OA\Property(property="reason", type="string", example="Client requested cancellation"),
 *             @OA\Property(property="notify_business", type="boolean", example=true)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Next booking cancelled successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Next booking cancelled"),
 *             @OA\Property(property="cancelled_booking", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="No upcoming bookings found for client"
 *     )
 * )
 */
class BookingDocs
{
    // This class exists solely for documentation purposes
}
