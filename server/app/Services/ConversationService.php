<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\ConversationMessage;
use App\Traits\ClientLookup;

class ConversationService
{
    use ClientLookup;
    // Start a conversation
    public function startConversation(int $clientId, ?int $agentId = null, int $businessId = null): Conversation
    {
        if (!$businessId) {
            throw new \InvalidArgumentException('Business ID is required to start a conversation');
        }

        // Validate that client belongs to the business
        $client = $this->findClientOrFail($clientId, $businessId);

        return Conversation::create([
            'client_id' => $clientId,
            'agent_id' => $agentId,
            'business_id' => $businessId,
        ]);
    }

    // Get conversation + messages
    public function getConversationWithMessages(int $conversationId): Conversation
    {
        return Conversation::with('messages')->findOrFail($conversationId);
    }

    // Store a message
    public function sendMessage(int $conversationId, int $clientId, int $businessId, string $sender, string $message, $metadata = null): ConversationMessage
    {
        // Validate that conversation exists and belongs to the correct business/client
        $conversation = Conversation::where('id', $conversationId)
            ->where('client_id', $clientId)
            ->where('business_id', $businessId)
            ->firstOrFail();

        // sender: 'user' or 'ai'
        return ConversationMessage::create([
            'conversation_id' => $conversationId,
            'client_id' => $clientId,
            'business_id' => $businessId,
            'sender' => $sender,
            'message' => $message,
            'metadata' => $metadata,
        ]);
    }
}
