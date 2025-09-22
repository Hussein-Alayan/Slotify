<?php

namespace App\Http\Docs;

/**
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/clients",
 *     summary="Get all clients for a business",
 *     tags={"Clients"},
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
 *         description="Clients retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="array", @OA\Items(
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="John Doe"),
 *                 @OA\Property(property="email", type="string", example="john@example.com"),
 *                 @OA\Property(property="phone", type="string", example="+1234567890"),
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
 *     path="/api/v1/businesses/{business}/clients",
 *     summary="Create a new client for a business",
 *     tags={"Clients"},
 *     security={{"sanctum": {}}},
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
 *             required={"name","email"},
 *             @OA\Property(property="name", type="string", example="John Doe"),
 *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *             @OA\Property(property="phone", type="string", example="+1234567890"),
 *             @OA\Property(property="address", type="string", example="123 Main St")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Client created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="John Doe"),
 *                 @OA\Property(property="email", type="string", example="john@example.com"),
 *                 @OA\Property(property="phone", type="string", example="+1234567890"),
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
 * @OA\Post(
 *     path="/api/v1/businesses/{business}/clients/find-or-create",
 *     summary="Find existing client or create new one",
 *     description="Public endpoint for voice calls to find or create clients",
 *     tags={"Clients"},
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
 *             required={"phone"},
 *             @OA\Property(property="phone", type="string", example="+1234567890"),
 *             @OA\Property(property="name", type="string", example="John Doe"),
 *             @OA\Property(property="email", type="string", format="email", example="john@example.com")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Client found or created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="client", type="object"),
 *                 @OA\Property(property="created", type="boolean", example=false)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input or processing error"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/businesses/{business}/clients/{client}",
 *     summary="Get specific client details",
 *     tags={"Clients"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="client",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Client ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Client details retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Client not found"
 *     )
 * )
 * @OA\Put(
 *     path="/api/v1/businesses/{business}/clients/{client}",
 *     summary="Update client information",
 *     tags={"Clients"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="client",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Client ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string", example="John Doe"),
 *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *             @OA\Property(property="phone", type="string", example="+1234567890"),
 *             @OA\Property(property="address", type="string", example="123 Main St")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Client updated successfully",
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
 *         description="Client not found"
 *     )
 * )
 * @OA\Delete(
 *     path="/api/v1/businesses/{business}/clients/{client}",
 *     summary="Delete a client",
 *     tags={"Clients"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Parameter(
 *         name="client",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Client ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Client deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Client deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Client not found"
 *     )
 * )
 */
class ClientDocs
{
    // This class exists solely for documentation purposes
}