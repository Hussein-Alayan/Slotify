<?php

namespace App\Http\Docs;

/**
 * @OA\Post(
 *     path="/api/v1/conversations",
 *     summary="Start a new conversation",
 *     tags={"Conversations"},
 *     security={{"sanctum": {}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"client_id","business_id"},
 *             @OA\Property(property="client_id", type="integer", example=17),
 *             @OA\Property(property="business_id", type="integer", example=5),
 *             @OA\Property(property="agent_id", type="integer", example=2, nullable=true)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Conversation started successfully"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input or error starting conversation"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/conversations/{conversation}",
 *     summary="Fetch conversation with messages",
 *     tags={"Conversations"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(name="conversation", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Conversation details returned successfully"
 *     )
 * )
 * @OA\Post(
 *     path="/api/v1/conversations/{conversation}/messages",
 *     summary="Store a new message in a conversation",
 *     tags={"Conversations"},
 *     security={{"sanctum": {}}},
 *     @OA\Parameter(name="conversation", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"sender","message"},
 *             @OA\Property(property="sender", type="string", example="client"),
 *             @OA\Property(property="message", type="string", example="Hello, I want to book a haircut"),
 *             @OA\Property(property="metadata", type="object", nullable=true)
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Message stored successfully"
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Failed to send message"
 *     )
 * )
 */
class ConversationDocs
{
    // This class exists solely for documentation purposes
}
