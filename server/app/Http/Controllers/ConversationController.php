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

    // Start a new conversation (called by n8n when first message arrives)
    public function startConversation(StoreConversationRequest $request)
    {
        $conversation = $this->conversationService->startConversation(
            $request->validated()['client_id'],
            $request->validated()['agent_id'] ?? null // optional AI agent
        );
        return $this->successResponse(new ConversationResource($conversation));
    }

    // Fetch conversation with messages
    public function show($conversationId)
    {
        $conversation = $this->conversationService->getConversationWithMessages($conversationId);
        return $this->successResponse(new ConversationResource($conversation));
    }

    // Store a new message in a conversation
    public function sendMessage(SendMessageRequest $request, $conversationId)
    {
        // You may need to fetch client_id and business_id from the conversation
        $conversation = \App\Models\Conversation::findOrFail($conversationId);
        $message = $this->conversationService->sendMessage(
            $conversation->client_id,
            $conversation->business_id,
            $request->validated()['sender'],
            $request->validated()['message'],
            $request->validated()['metadata'] ?? null
        );
        return $this->successResponse(['message' => $message], 201);
    }
}
