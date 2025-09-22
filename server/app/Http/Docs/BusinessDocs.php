<?php

namespace App\Http\Docs;

/**
 * @OA\Post(
 *     path="/api/v1/business-profile",
 *     summary="Create or update a business profile",
 *     tags={"Business"},
 *     security={{"sanctum": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name","address"},
 *             @OA\Property(property="name", type="string", example="Barber Shop"),
 *             @OA\Property(property="address", type="string", example="123 Main St, City"),
 *             @OA\Property(property="phone", type="string", example="+1234567890"),
 *             @OA\Property(property="description", type="string", example="Best barbers in town")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Business profile created or updated successfully"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Business not found or could not be created"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses",
 *     summary="Get all businesses for authenticated user",
 *     tags={"Business"},
 *     security={{"sanctum": {}}},
 *     @OA\Response(
 *         response=200,
 *         description="Businesses retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="array", @OA\Items(
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="Elite Barbershop"),
 *                 @OA\Property(property="address", type="string", example="123 Main St"),
 *                 @OA\Property(property="phone", type="string", example="+1234567890"),
 *                 @OA\Property(property="description", type="string", example="Best barbers in town")
 *             ))
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthenticated"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/public/list",
 *     summary="Get public list of businesses",
 *     description="Public endpoint for voice calls and external integrations",
 *     tags={"Business"},
 *     @OA\Parameter(
 *         name="active_only",
 *         in="query",
 *         required=false,
 *         @OA\Schema(type="boolean"),
 *         description="Filter to show only active businesses"
 *     ),
 *     @OA\Parameter(
 *         name="limit",
 *         in="query",
 *         required=false,
 *         @OA\Schema(type="integer"),
 *         description="Limit number of results"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Public businesses list retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="array", @OA\Items(
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="Elite Barbershop"),
 *                 @OA\Property(property="phone", type="string", example="+1234567890"),
 *                 @OA\Property(property="is_active", type="boolean", example=true)
 *             ))
 *         )
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/{business}",
 *     summary="Get specific business details",
 *     tags={"Business"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Business details retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="Elite Barbershop"),
 *                 @OA\Property(property="address", type="string", example="123 Main St"),
 *                 @OA\Property(property="phone", type="string", example="+1234567890"),
 *                 @OA\Property(property="description", type="string", example="Best barbers in town"),
 *                 @OA\Property(property="working_hours", type="object"),
 *                 @OA\Property(property="services_count", type="integer", example=5),
 *                 @OA\Property(property="staff_count", type="integer", example=3)
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
 *     path="/api/v1/businesses/{business}/workflow",
 *     summary="Get business workflow configuration",
 *     description="Public endpoint for workflow and automation systems",
 *     tags={"Business"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Business workflow configuration retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="business_id", type="integer", example=1),
 *                 @OA\Property(property="business_name", type="string", example="Elite Barbershop"),
 *                 @OA\Property(property="workflow_config", type="object",
 *                     @OA\Property(property="booking_enabled", type="boolean", example=true),
 *                     @OA\Property(property="auto_confirmation", type="boolean", example=false),
 *                     @OA\Property(property="notification_settings", type="object")
 *                 ),
 *                 @OA\Property(property="integration_endpoints", type="object",
 *                     @OA\Property(property="whatsapp_webhook", type="string"),
 *                     @OA\Property(property="ai_processing", type="string")
 *                 )
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Business not found"
 *     )
 * )
 */
class BusinessDocs
{
    // This class exists solely for documentation purposes
}
