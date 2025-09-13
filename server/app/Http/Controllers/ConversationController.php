<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConversationRequest;
use App\Http\Requests\SendMessageRequest;
use App\Http\Resources\ConversationResource;
use App\Services\ConversationService;


use App\Traits\ApiResponseTrait;

class ConversationController extends Controller
{
    use ApiResponseTrait;

    protected $conversationService;

    public function __construct(ConversationService $conversationService)
    {
        $this->conversationService = $conversationService;
    }

    /**
     * Start a new conversation
     * @see App\Http\Docs\ConversationDocs for API documentation
     */
    public function startConversation(StoreConversationRequest $request)
    {
        try {
            $conversation = $this->conversationService->startConversation(
                $request->validated()['client_id'],
                $request->validated()['agent_id'] ?? null, // optional AI agent
                $request->validated()['business_id']
            );
            return $this->successResponse(new ConversationResource($conversation));
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Fetch conversation with messages
     * @see App\Http\Docs\ConversationDocs for API documentation
     */
    public function show($conversationId)
    {
        $conversation = $this->conversationService->getConversationWithMessages($conversationId);
        return $this->successResponse(new ConversationResource($conversation));
    }

    /**
     * Store a new message in a conversation
     * @see App\Http\Docs\ConversationDocs for API documentation
     */
    public function sendMessage(SendMessageRequest $request, $conversationId)
    {
        try {
            // Fetch conversation to get client_id and business_id
            $conversation = \App\Models\Conversation::findOrFail($conversationId);
            $message = $this->conversationService->sendMessage(
                $conversationId,
                $conversation->client_id,
                $conversation->business_id,
                $request->validated()['sender'],
                $request->validated()['message'],
                $request->validated()['metadata'] ?? null
            );
            return $this->successResponse(['message' => $message], 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to send message: ' . $e->getMessage(), 400);
        }
    }
}
