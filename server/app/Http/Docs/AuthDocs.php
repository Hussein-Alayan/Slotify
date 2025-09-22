<?php

namespace App\Http\Docs;

/**
 * @OA\Post(
 *     path="/api/v1/register",
 *     summary="Register a new user",
 *     tags={"Authentication"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"name","email","password","password_confirmation"},
 *             @OA\Property(property="name", type="string", example="John Doe"),
 *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *             @OA\Property(property="password", type="string", format="password", example="password123"),
 *             @OA\Property(property="password_confirmation", type="string", format="password", example="password123")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="User registered successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="user", type="object"),
 *                 @OA\Property(property="token", type="string")
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
 *     path="/api/v1/login",
 *     summary="Login user",
 *     tags={"Authentication"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"email","password"},
 *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *             @OA\Property(property="password", type="string", format="password", example="password123")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Login successful",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="user", type="object"),
 *                 @OA\Property(property="token", type="string")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Invalid credentials",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="Invalid Credentials")
 *         )
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/auth/google",
 *     summary="Redirect to Google OAuth",
 *     description="Redirect user to Google OAuth authentication page",
 *     tags={"Authentication"},
 *     @OA\Response(
 *         response=302,
 *         description="Redirect to Google OAuth page"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="OAuth service error"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/auth/google/callback",
 *     summary="Handle Google OAuth callback",
 *     description="Process Google OAuth callback and authenticate user",
 *     tags={"Authentication"},
 *     @OA\Parameter(
 *         name="code",
 *         in="query",
 *         required=true,
 *         @OA\Schema(type="string"),
 *         description="Authorization code from Google"
 *     ),
 *     @OA\Parameter(
 *         name="state",
 *         in="query",
 *         required=false,
 *         @OA\Schema(type="string"),
 *         description="State parameter for CSRF protection"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Google authentication successful",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="user", type="object"),
 *                 @OA\Property(property="token", type="string"),
 *                 @OA\Property(property="auth_method", type="string", example="google")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="OAuth authentication failed",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="message", type="string", example="Google authentication failed")
 *         )
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/me",
 *     summary="Get current authenticated user",
 *     description="Retrieve current user's profile information",
 *     tags={"Authentication"},
 *     security={{"sanctum": {}}},
 *     @OA\Response(
 *         response=200,
 *         description="User profile retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="John Doe"),
 *                 @OA\Property(property="email", type="string", example="john@example.com"),
 *                 @OA\Property(property="email_verified_at", type="string", format="datetime", nullable=true),
 *                 @OA\Property(property="created_at", type="string", format="datetime"),
 *                 @OA\Property(property="updated_at", type="string", format="datetime")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthenticated",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Unauthenticated.")
 *         )
 *     )
 * )
 */
class AuthDocs
{
    // This class exists solely for documentation purposes
}
