<?php

namespace App\Http\Docs;

/**
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/resources",
 *     summary="Get all resources (staff) for a business",
 *     tags={"Resources"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Resources retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="array", @OA\Items(
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="John Smith"),
 *                 @OA\Property(property="email", type="string", example="john@barbershop.com"),
 *                 @OA\Property(property="role", type="string", example="barber"),
 *                 @OA\Property(property="is_available", type="boolean", example=true),
 *                 @OA\Property(property="business_id", type="integer", example=1)
 *             ))
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized access to business"
 *     )
 * )
 * @OA\Post(
 *     path="/api/v1/businesses/{business}/resources",
 *     summary="Create a new resource (staff member) for a business",
 *     tags={"Resources"},
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
 *             required={"name","email","role"},
 *             @OA\Property(property="name", type="string", example="John Smith"),
 *             @OA\Property(property="email", type="string", format="email", example="john@barbershop.com"),
 *             @OA\Property(property="role", type="string", example="barber"),
 *             @OA\Property(property="phone", type="string", example="+1234567890"),
 *             @OA\Property(property="specialties", type="array", @OA\Items(type="string"), example={"haircut", "beard trim"}),
 *             @OA\Property(property="working_hours", type="object", example={"monday": {"start": "09:00", "end": "17:00"}})
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Resource created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="John Smith"),
 *                 @OA\Property(property="email", type="string", example="john@barbershop.com"),
 *                 @OA\Property(property="role", type="string", example="barber"),
 *                 @OA\Property(property="business_id", type="integer", example=1)
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
 *     )
 * )
 * @OA\Patch(
 *     path="/api/v1/businesses/{business}/resources/{resource}",
 *     summary="Update resource information",
 *     tags={"Resources"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="resource",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Resource ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string", example="John Smith"),
 *             @OA\Property(property="email", type="string", format="email", example="john@barbershop.com"),
 *             @OA\Property(property="role", type="string", example="senior barber"),
 *             @OA\Property(property="phone", type="string", example="+1234567890"),
 *             @OA\Property(property="specialties", type="array", @OA\Items(type="string")),
 *             @OA\Property(property="working_hours", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Resource updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Resource not found"
 *     )
 * )
 * @OA\Delete(
 *     path="/api/v1/businesses/{business}/resources/{resource}",
 *     summary="Delete a resource",
 *     tags={"Resources"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="resource",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Resource ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Resource deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Resource deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Resource not found"
 *     )
 * )
 * @OA\Post(
 *     path="/api/v1/businesses/{business}/resources/{resource}/absent",
 *     summary="Mark resource as absent",
 *     tags={"Resources"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="resource",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Resource ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"start_date"},
 *             @OA\Property(property="start_date", type="string", format="date", example="2025-09-22"),
 *             @OA\Property(property="end_date", type="string", format="date", example="2025-09-23"),
 *             @OA\Property(property="reason", type="string", example="sick leave"),
 *             @OA\Property(property="notes", type="string", example="Will return on Monday")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Resource marked as absent successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Resource marked as absent")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     )
 * )
 * @OA\Post(
 *     path="/api/v1/businesses/{business}/resources/{resource}/present",
 *     summary="Mark resource as present (remove absence)",
 *     tags={"Resources"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="resource",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Resource ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Resource marked as present successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Resource marked as present")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Resource not found"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/resources/{resource}/absence-impact",
 *     summary="Get impact analysis of resource absence",
 *     tags={"Resources"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="resource",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Resource ID"
 *     ),
 *     @OA\Parameter(
 *         name="start_date",
 *         in="query",
 *         required=true,
 *         @OA\Schema(type="string", format="date"),
 *         description="Start date for absence impact analysis"
 *     ),
 *     @OA\Parameter(
 *         name="end_date",
 *         in="query",
 *         required=true,
 *         @OA\Schema(type="string", format="date"),
 *         description="End date for absence impact analysis"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Absence impact analysis retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="affected_bookings", type="integer", example=5),
 *                 @OA\Property(property="reassignment_options", type="array", @OA\Items(type="object")),
 *                 @OA\Property(property="revenue_impact", type="number", format="float", example=250.00)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Resource not found"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/absent-staff",
 *     summary="Get list of currently absent staff",
 *     tags={"Resources"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="date",
 *         in="query",
 *         required=false,
 *         @OA\Schema(type="string", format="date"),
 *         description="Date to check for absent staff (defaults to today)"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Absent staff list retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="array", @OA\Items(
 *                 @OA\Property(property="resource_id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="John Smith"),
 *                 @OA\Property(property="absence_reason", type="string", example="sick leave"),
 *                 @OA\Property(property="start_date", type="string", format="date"),
 *                 @OA\Property(property="end_date", type="string", format="date")
 *             ))
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Unauthorized access to business"
 *     )
 * )
 * @OA\Post(
 *     path="/api/v1/resources/{resource}/services",
 *     summary="Assign services to a resource",
 *     tags={"Resources"},
 *     @OA\Parameter(
 *         name="resource",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Resource ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"service_ids"},
 *             @OA\Property(property="service_ids", type="array", @OA\Items(type="integer"), example={1, 2, 3})
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Services assigned to resource successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Services assigned successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Resource not found"
 *     )
 * )
 */
class ResourceDocs
{
    // This class exists solely for documentation purposes
}