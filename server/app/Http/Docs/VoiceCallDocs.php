<?php

namespace App\Http\Docs;

/**
 * @OA\Post(
 *     path="/api/v1/voice/log",
 *     summary="Log a new voice call",
 *     description="Create a new voice call record for tracking and analysis",
 *     tags={"Voice Calls"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"caller_phone","business_id"},
 *             @OA\Property(property="caller_phone", type="string", example="+1234567890", description="Phone number of the caller"),
 *             @OA\Property(property="business_id", type="integer", example=1, description="ID of the business being called"),
 *             @OA\Property(property="call_duration", type="integer", example=120, description="Duration of call in seconds"),
 *             @OA\Property(property="call_type", type="string", example="booking_inquiry", description="Type of call"),
 *             @OA\Property(property="external_call_id", type="string", example="call_123456", description="External system call ID"),
 *             @OA\Property(property="metadata", type="object", description="Additional call metadata")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Voice call logged successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="caller_phone", type="string", example="+1234567890"),
 *                 @OA\Property(property="business_id", type="integer", example=1),
 *                 @OA\Property(property="status", type="string", example="active"),
 *                 @OA\Property(property="created_at", type="string", format="datetime")
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
 *     path="/api/v1/voice/{id}/transcript",
 *     summary="Update call transcript",
 *     description="Add or update the transcript for a voice call",
 *     tags={"Voice Calls"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Voice call ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"transcript"},
 *             @OA\Property(property="transcript", type="string", example="Customer called to book a haircut appointment for tomorrow at 3pm", description="Call transcript text"),
 *             @OA\Property(property="language", type="string", example="en", description="Language of the transcript"),
 *             @OA\Property(property="confidence_score", type="number", format="float", example=0.95, description="Transcript confidence score"),
 *             @OA\Property(property="speaker_segments", type="array", @OA\Items(type="object"), description="Individual speaker segments")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Transcript updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="transcript_updated", type="boolean", example=true),
 *                 @OA\Property(property="transcript_length", type="integer", example=85)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Voice call not found"
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     )
 * )
 * @OA\Post(
 *     path="/api/v1/voice/{id}/end",
 *     summary="End a voice call",
 *     description="Mark a voice call as completed and finalize call data",
 *     tags={"Voice Calls"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Voice call ID"
 *     ),
 *     @OA\RequestBody(
 *         required=false,
 *         @OA\JsonContent(
 *             @OA\Property(property="end_reason", type="string", example="completed", description="Reason for ending the call"),
 *             @OA\Property(property="final_duration", type="integer", example=180, description="Final call duration in seconds"),
 *             @OA\Property(property="call_outcome", type="string", example="booking_created", description="Outcome of the call"),
 *             @OA\Property(property="notes", type="string", example="Customer successfully booked haircut appointment", description="Additional notes about the call")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Voice call ended successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="status", type="string", example="completed"),
 *                 @OA\Property(property="final_duration", type="integer", example=180),
 *                 @OA\Property(property="ended_at", type="string", format="datetime")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Voice call not found"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Call already ended or invalid state"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/voice/business-context/{business}",
 *     summary="Get business context for voice calls",
 *     description="Retrieve business information needed for voice call processing and AI assistance",
 *     tags={"Voice Calls"},
 *     @OA\Parameter(
 *         name="business",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer"),
 *         description="Business ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Business context retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="business", type="object",
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="name", type="string", example="Elite Barbershop"),
 *                     @OA\Property(property="phone", type="string", example="+1234567890"),
 *                     @OA\Property(property="address", type="string", example="123 Main St"),
 *                     @OA\Property(property="working_hours", type="object")
 *                 ),
 *                 @OA\Property(property="services", type="array", @OA\Items(
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="name", type="string", example="Haircut"),
 *                     @OA\Property(property="duration", type="integer", example=30),
 *                     @OA\Property(property="price", type="number", format="float", example=25.00)
 *                 )),
 *                 @OA\Property(property="available_staff", type="array", @OA\Items(
 *                     @OA\Property(property="id", type="integer", example=1),
 *                     @OA\Property(property="name", type="string", example="John Smith"),
 *                     @OA\Property(property="specialties", type="array", @OA\Items(type="string"))
 *                 )),
 *                 @OA\Property(property="booking_rules", type="object",
 *                     @OA\Property(property="advance_booking_days", type="integer", example=30),
 *                     @OA\Property(property="minimum_notice_hours", type="integer", example=2),
 *                     @OA\Property(property="cancellation_policy", type="string")
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
 *         description="Business not accessible or inactive"
 *     )
 * )
 */
class VoiceCallDocs
{
    // This class exists solely for documentation purposes
}