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
        

        // Fetch clients by unique fields (phone/email)
        $client1 = \App\Models\Client::where('business_id', 1)->where('phone', '+1234567890')->first(); // John Doe
        $client2 = \App\Models\Client::where('business_id', 1)->where('phone', '+1234567891')->first(); // Jane Smith
        $client3 = \App\Models\Client::where('business_id', 2)->where('phone', '+1234567892')->first(); // AI Test Client
        $client4 = \App\Models\Client::where('business_id', 2)->where('phone', '+1234567893')->first(); // WhatsApp User

        // Only create conversations if clients exist
        $conv1 = $client1 ? Conversation::where('business_id', 1)->where('client_id', $client1->id)->first() : null;
        $conv2 = $client3 ? Conversation::where('business_id', 2)->where('client_id', $client3->id)->first() : null;
        $conv3 = $client4 ? Conversation::where('business_id', 2)->where('client_id', $client4->id)->first() : null;

        if (!$conv1 && $client1) {
            $conv1 = Conversation::create([
                'business_id' => 1,
                'client_id' => $client1->id,
                'agent_id' => null,
            ]);
        }

        if (!$conv2 && $client3) {
            $conv2 = Conversation::create([
                'business_id' => 2,
                'client_id' => $client3->id,
                'agent_id' => null,
            ]);
        }

        if (!$conv3 && $client4) {
            $conv3 = Conversation::create([
                'business_id' => 2,
                'client_id' => $client4->id,
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
