<?php

namespace App\Http\Docs;

/**
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/total-services",
 *     summary="Get total number of services for a business",
 *     tags={"Business Statistics"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Total services count retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="total_services", type="integer", example=15),
 *                 @OA\Property(property="business_id", type="integer", example=1)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Business not found"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized access to business"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/active-services",
 *     summary="Get number of active services for a business",
 *     tags={"Business Statistics"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Active services count retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="active_services", type="integer", example=12),
 *                 @OA\Property(property="total_services", type="integer", example=15),
 *                 @OA\Property(property="business_id", type="integer", example=1)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Business not found"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized access to business"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/total-clients",
 *     summary="Get total number of clients for a business",
 *     tags={"Business Statistics"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="period",
 *         in="query",
 *         required=false,
 *         @OA\Schema(type="string", enum={"all", "month", "year"}),
 *         description="Time period for client count (defaults to all)"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Total clients count retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="total_clients", type="integer", example=150),
 *                 @OA\Property(property="period", type="string", example="all"),
 *                 @OA\Property(property="business_id", type="integer", example=1)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Business not found"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized access to business"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/total-bookings",
 *     summary="Get total number of bookings for a business",
 *     tags={"Business Statistics"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="period",
 *         in="query",
 *         required=false,
 *         @OA\Schema(type="string", enum={"all", "today", "week", "month", "year"}),
 *         description="Time period for booking count (defaults to all)"
 *     ),
 *     @OA\Parameter(
 *         name="status",
 *         in="query",
 *         required=false,
 *         @OA\Schema(type="string", enum={"all", "confirmed", "completed", "cancelled"}),
 *         description="Filter by booking status (defaults to all)"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Total bookings count retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="total_bookings", type="integer", example=425),
 *                 @OA\Property(property="period", type="string", example="all"),
 *                 @OA\Property(property="status_filter", type="string", example="all"),
 *                 @OA\Property(property="business_id", type="integer", example=1),
 *                 @OA\Property(property="breakdown", type="object",
 *                     @OA\Property(property="confirmed", type="integer", example=320),
 *                     @OA\Property(property="completed", type="integer", example=95),
 *                     @OA\Property(property="cancelled", type="integer", example=10)
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Business not found"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized access to business"
 *     )
 * )
 */
class BusinessStatsDocs
{
    // This class exists solely for documentation purposes
}