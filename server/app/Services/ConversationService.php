<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;

class ConversationService
{
    // Start a conversation
    public function startConversation(int $clientId, ?int $agentId = null): Conversation
    {
        return Conversation::create([
            'client_id' => $clientId,
            'agent_id' => $agentId,
        ]);
    }

    // Get conversation + messages
    public function getConversationWithMessages(int $conversationId): Conversation
    {
        return Conversation::with('messages')->findOrFail($conversationId);
    }

    // Store a message
    public function sendMessage(int $clientId, int $businessId, string $sender, string $message, $metadata = null): Message
    {
        // sender: 'user' or 'ai'
        return Message::create([
            'client_id' => $clientId,
            'business_id' => $businessId,
            'sender' => $sender,
            'message' => $message,
            'metadata' => $metadata,
        ]);
    }
}
