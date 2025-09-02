<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConversationRequest;
use App\Http\Requests\SendMessageRequest;
use App\Http\Resources\ConversationResource;
use App\Services\ConversationService;

class ConversationController extends Controller
{
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

        return new ConversationResource($conversation);
    }

    // Fetch conversation with messages
    public function show($conversationId)
    {
        $conversation = $this->conversationService->getConversationWithMessages($conversationId);
        return new ConversationResource($conversation);
    }

    // Store a new message in a conversation
    public function sendMessage(SendMessageRequest $request, $conversationId)
    {
        $message = $this->conversationService->sendMessage(
            $conversationId,
            $request->validated()['sender'],
            $request->validated()['content']
        );

        return response()->json(['success' => true, 'message' => $message], 201);
    }
}
