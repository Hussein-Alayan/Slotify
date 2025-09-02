<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conversation;
use App\Models\ConversationMessage;

class TestConversationSeeder extends Seeder
{
    public function run(): void
    {
        // Create a test conversation
        $conversation = Conversation::create([
            'client_id' => 1, // assumes TestClientSeeder runs first
            'business_id' => 1, // assumes TestBusinessSeeder runs first
            'agent_id' => null,
        ]);

        // Create some test messages
        ConversationMessage::create([
            'conversation_id' => $conversation->id,
            'client_id' => 1,
            'business_id' => 1,
            'sender' => 'user',
            'message' => 'Hello, I would like to book an appointment.',
            'metadata' => null,
        ]);

        ConversationMessage::create([
            'conversation_id' => $conversation->id,
            'client_id' => 1,
            'business_id' => 1,
            'sender' => 'ai',
            'message' => 'Hello! I would be happy to help you book an appointment. What service are you interested in?',
            'metadata' => ['intent' => 'booking_inquiry'],
        ]);
    }
}
