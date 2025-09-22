<?php

namespace App\Http\Docs;

/**
 * @OA\Post(
 *     path="/api/v1/ai/process-message",
 *     summary="Process AI message and handle booking flow",
 *     description="Processes user messages through AI to extract booking intent, handle multi-step booking flow, and create bookings when all required information is collected. This endpoint is designed for n8n workflows and does not require authentication.",
 *     tags={"AI Booking"},
 *     @OA\RequestBody(
 *         required=true,
 *         description="Message processing request payload",
 *         @OA\JsonContent(
 *             required={"conversation_id", "client_id", "message"},
 *             @OA\Property(
 *                 property="conversation_id", 
 *                 type="integer", 
 *                 example=1,
 *                 description="ID of the conversation this message belongs to"
 *             ),
 *             @OA\Property(
 *                 property="client_id", 
 *                 type="integer", 
 *                 example=1,
 *                 description="ID of the client sending the message"
 *             ),
 *             @OA\Property(
 *                 property="message", 
 *                 type="string", 
 *                 example="I want to book a haircut for tomorrow at 3pm",
 *                 description="The user's message containing booking intent or information"
 *             ),
 *             @OA\Property(
 *                 property="force_booking_data", 
 *                 type="object", 
 *                 nullable=true,
 *                 description="Optional object to force specific booking data, bypassing AI analysis",
 *                 @OA\Property(property="service_id", type="integer", example=1),
 *                 @OA\Property(property="date", type="string", format="date", example="2024-12-25"),
 *                 @OA\Property(property="time", type="string", format="time", example="15:00")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Message processed successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="message_processed", type="boolean", description="Whether the message was successfully processed"),
 *             @OA\Property(property="flow_steps", type="array", @OA\Items(type="string"), description="Steps taken during processing"),
 *             @OA\Property(property="ai_analysis", type="object", description="AI analysis results of the message"),
 *             @OA\Property(property="booking_created", type="boolean", description="Whether a booking was created"),
 *             @OA\Property(property="booking", type="object", nullable=true, description="Created booking details if booking was made"),
 *             @OA\Property(property="conversation_summary", type="object", description="Summary of the conversation"),
 *             @OA\Property(property="processing_metadata", type="object", description="Additional processing information")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", description="Error message"),
 *             @OA\Property(property="errors", type="object", description="Validation errors")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Server error",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", description="Error message")
 *         )
 *     )
 * )
 */
class AIBookingDocs
{
    // This class exists solely for documentation purposes
}
