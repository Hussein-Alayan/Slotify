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
 */
class BookingDocs
{
    // This class exists solely for documentation purposes
}
