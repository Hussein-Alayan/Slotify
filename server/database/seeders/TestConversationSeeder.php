<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conversation;
use App\Models\ConversationMessage;

class TestConversationSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing conversations to avoid duplicates
        Conversation::whereIn('business_id', [1, 2])->delete();

        // Create conversations for testing
        $conversations = [
            [
                'id' => 1,
                'business_id' => 1,
                'client_id' => 1, // John Doe from Business 1
                'agent_id' => null,
            ],
            [
                'id' => 2,
                'business_id' => 2,
                'client_id' => 3, // AI Test Client from Business 2
                'agent_id' => null,
            ],
            [
                'id' => 3,
                'business_id' => 2,
                'client_id' => 4, // WhatsApp User from Business 2
                'agent_id' => null,
            ],
        ];

        foreach ($conversations as $conversationData) {
            $conversation = Conversation::create($conversationData);

            // Create initial message for each conversation
            ConversationMessage::create([
                'conversation_id' => $conversation->id,
                'client_id' => $conversation->client_id,
                'business_id' => $conversation->business_id,
                'sender' => 'ai',
                'direction' => 'outbound',
                'message' => 'Hello! How can I help you today?',
                'metadata' => json_encode(['type' => 'greeting']),
                'delivery_status' => 'sent',
            ]);
        }

        $this->command->info('✅ Created test conversations with initial messages');
    }
}
