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
 */
class BusinessDocs
{
    // This class exists solely for documentation purposes
}
