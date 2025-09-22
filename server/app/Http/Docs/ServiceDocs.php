<?php

namespace App\Http\Docs;

/**
 * @OA\Post(
 *     path="/api/v1/businesses/{business}/services",
 *     summary="Create a new service for a business",
 *     tags={"Services"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name","duration","price"},
 *             @OA\Property(property="name", type="string", example="Haircut"),
 *             @OA\Property(property="description", type="string", example="Professional haircut service"),
 *             @OA\Property(property="duration", type="integer", example=30, description="Duration in minutes"),
 *             @OA\Property(property="price", type="number", format="float", example=25.00),
 *             @OA\Property(property="category", type="string", example="hair"),
 *             @OA\Property(property="is_active", type="boolean", example=true),
 *             @OA\Property(property="booking_buffer", type="integer", example=5, description="Buffer time in minutes")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Service created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="Haircut"),
 *                 @OA\Property(property="description", type="string", example="Professional haircut service"),
 *                 @OA\Property(property="duration", type="integer", example=30),
 *                 @OA\Property(property="price", type="number", format="float", example=25.00),
 *                 @OA\Property(property="business_id", type="integer", example=1),
 *                 @OA\Property(property="is_active", type="boolean", example=true)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string"),
 *             @OA\Property(property="errors", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized access to business"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/services",
 *     summary="Get all services for a business",
 *     tags={"Services"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="active_only",
 *         in="query",
 *         required=false,
 *         @OA\Schema(type="boolean"),
 *         description="Filter to show only active services"
 *     ),
 *     @OA\Parameter(
 *         name="category",
 *         in="query",
 *         required=false,
 *         @OA\Schema(type="string"),
 *         description="Filter by service category"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Services retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="array", @OA\Items(
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="Haircut"),
 *                 @OA\Property(property="description", type="string", example="Professional haircut service"),
 *                 @OA\Property(property="duration", type="integer", example=30),
 *                 @OA\Property(property="price", type="number", format="float", example=25.00),
 *                 @OA\Property(property="category", type="string", example="hair"),
 *                 @OA\Property(property="is_active", type="boolean", example=true),
 *                 @OA\Property(property="business_id", type="integer", example=1)
 *             ))
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized access to business"
 *     )
 * )
 * @OA\Patch(
 *     path="/api/v1/businesses/{business}/services/{service}",
 *     summary="Update service information",
 *     tags={"Services"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="service",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Service ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string", example="Premium Haircut"),
 *             @OA\Property(property="description", type="string", example="Premium haircut with styling"),
 *             @OA\Property(property="duration", type="integer", example=45, description="Duration in minutes"),
 *             @OA\Property(property="price", type="number", format="float", example=35.00),
 *             @OA\Property(property="category", type="string", example="hair"),
 *             @OA\Property(property="is_active", type="boolean", example=true),
 *             @OA\Property(property="booking_buffer", type="integer", example=10, description="Buffer time in minutes")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Service updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="Premium Haircut"),
 *                 @OA\Property(property="description", type="string", example="Premium haircut with styling"),
 *                 @OA\Property(property="duration", type="integer", example=45),
 *                 @OA\Property(property="price", type="number", format="float", example=35.00),
 *                 @OA\Property(property="business_id", type="integer", example=1),
 *                 @OA\Property(property="is_active", type="boolean", example=true)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Service not found"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized access to business"
 *     )
 * )
 */
class ServiceDocs
{
    // This class exists solely for documentation purposes
}