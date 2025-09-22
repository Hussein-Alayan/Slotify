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
        

        // Fetch clients for Business 3
        $client1 = \App\Models\Client::where('business_id', 3)->where('phone', '+96170653458')->first(); // Test Client
        $client2 = \App\Models\Client::where('business_id', 3)->where('phone', '+1234567894')->first(); // WhatsApp Tester

        // Only create conversations if clients exist
        $conv1 = $client1 ? Conversation::where('business_id', 3)->where('client_id', $client1->id)->first() : null;
        $conv2 = $client2 ? Conversation::where('business_id', 3)->where('client_id', $client2->id)->first() : null;

        if (!$conv1 && $client1) {
            $conv1 = Conversation::create([
                'business_id' => 3,
                'client_id' => $client1->id,
                'agent_id' => null,
            ]);
        }

        if (!$conv2 && $client2) {
            $conv2 = Conversation::create([
                'business_id' => 3,
                'client_id' => $client2->id,
                'agent_id' => null,
            ]);
        }

        // Create initial messages only if conversation was just created
        foreach ([$conv1, $conv2] as $conversation) {
            if ($conversation && $conversation->wasRecentlyCreated) {
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

        $this->command->info('✅ Ensured test conversations exist for business +15551388631');
    }
}
