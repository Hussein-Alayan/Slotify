<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conversation;
use App\Models\ConversationMessage;

class TestConversationSeeder extends Seeder
{
    public function run(): void
    {
        // Don't clear existing conversations to avoid conflicts
        // Just ensure we have the basic conversations needed for testing
        
        // Check if we have the conversations we need
        $conv1 = Conversation::where('business_id', 1)->where('client_id', 1)->first();
        $conv2 = Conversation::where('business_id', 2)->where('client_id', 3)->first();
        $conv3 = Conversation::where('business_id', 2)->where('client_id', 4)->first();

        // Only create if missing (let database auto-assign IDs)
        if (!$conv1) {
            $conv1 = Conversation::create([
                'business_id' => 1,
                'client_id' => 1,
                'agent_id' => null,
            ]);
        }

        if (!$conv2) {
            $conv2 = Conversation::create([
                'business_id' => 2,
                'client_id' => 3,
                'agent_id' => null,
            ]);
        }

        if (!$conv3) {
            $conv3 = Conversation::create([
                'business_id' => 2,
                'client_id' => 4,
                'agent_id' => null,
            ]);
        }

        // Create initial messages only if conversation was just created
        foreach ([$conv1, $conv2, $conv3] as $conversation) {
            if ($conversation->wasRecentlyCreated) {
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
        }

        $this->command->info('✅ Ensured test conversations exist (without conflicts)');
    }
}
