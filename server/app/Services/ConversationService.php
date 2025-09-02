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
    public function sendMessage(int $conversationId, string $sender, string $content): Message
    {
        return Message::create([
            'conversation_id' => $conversationId,
            'sender' => $sender, // 'client', 'agent', 'ai_agent'
            'content' => $content,
        ]);
    }
}
