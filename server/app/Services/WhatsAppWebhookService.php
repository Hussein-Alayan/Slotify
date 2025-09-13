<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Client;
use App\Models\Conversation;
use App\Models\ConversationMessage;
use App\Models\CommunicationChannel;
use Illuminate\Support\Facades\Log;

class WhatsAppWebhookService
{
    /**
     * Process incoming WhatsApp message from webhook
     */
    public function processIncomingMessage(array $data): array
    {
        Log::info('Processing WhatsApp webhook message', $data);

        // Step 1: Find business by incoming phone number
        $business = $this->findBusinessByPhone($data['to_phone']);
        if (!$business) {
            throw new \Exception("No business found for phone number: {$data['to_phone']}");
        }

        // Step 2: Find or create client
        $client = $this->findOrCreateClient($business->id, $data['from_phone'], $data['from_name'] ?? null);

        // Step 3: Find or create conversation
        $conversation = $this->findOrCreateConversation($business->id, $client->id);

        // Step 4: Store the incoming message
        $message = $this->storeIncomingMessage(
            $conversation->id,
            $client->id,
            $business->id,
            $data['message_content'],
            $data['from_phone'],
            $data['external_message_id'] ?? null
        );

        // Step 5: Update client activity
        $client->updateWhatsAppActivity();

        return [
            'business' => $business,
            'client' => $client,
            'conversation' => $conversation,
            'message' => $message,
            'processed_at' => now()->toISOString(),
        ];
    }

    /**
     * Find business by incoming phone number
     */
    private function findBusinessByPhone(string $phoneNumber): ?Business
    {
        $normalizedPhone = $this->normalizePhoneNumber($phoneNumber);
        
        $channel = CommunicationChannel::findBusinessByPhone($normalizedPhone);
        
        if (!$channel || !$channel->business) {
            return null;
        }
        
        // Ensure business has workflow data loaded
        $business = $channel->business;
        if (!$business->workflow) {
            // Generate workflow data if missing
            $business = $this->ensureBusinessWorkflow($business);
        }
        
        return $business;
    }
    
    /**
     * Ensure business has workflow data, generate if missing
     */
    private function ensureBusinessWorkflow(Business $business): Business
    {
        // Reload with relationships
        $business = Business::with(['services', 'resources', 'bookingRules', 'communicationChannels', 'clients'])
            ->find($business->id);
            
        // Generate workflow JSON if missing
        if (!$business->workflow) {
            $workflow = [
                'business' => $business->toArray(),
                'services' => $business->services->toArray(),
                'resources' => $business->resources->toArray(),
                'booking_rules' => $business->bookingRules, // hasOne returns model or null
                'communication_channels' => $business->communicationChannels->toArray(),
                'clients' => $business->clients->toArray(),
            ];
            $business->workflow = json_encode($workflow);
            $business->save();
        }
        
        return $business;
    }

    /**
     * Find or create client by phone number
     */
    private function findOrCreateClient(int $businessId, string $phoneNumber, ?string $name): Client
    {
        return Client::findOrCreateByPhone($businessId, $phoneNumber, $name);
    }

    /**
     * Find or create conversation between business and client
     */
    private function findOrCreateConversation(int $businessId, int $clientId): Conversation
    {
        $conversation = Conversation::where('business_id', $businessId)
            ->where('client_id', $clientId)
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'business_id' => $businessId,
                'client_id' => $clientId,
                'agent_id' => null, // AI agent
            ]);
        }

        return $conversation;
    }

    /**
     * Store incoming WhatsApp message
     */
    private function storeIncomingMessage(
        int $conversationId,
        int $clientId,
        int $businessId,
        string $messageContent,
        string $sourcePhone,
        ?string $externalMessageId
    ): ConversationMessage {
        return ConversationMessage::createInboundMessage(
            $conversationId,
            $clientId,
            $businessId,
            $messageContent,
            $sourcePhone,
            $externalMessageId
        );
    }

    /**
     * Normalize phone number for consistent lookup
     */
    private function normalizePhoneNumber(string $phoneNumber): string
    {
        return Client::normalizePhone($phoneNumber);
    }

    /**
     * Verify webhook signature (provider-specific)
     */
    public function verifyWebhookSignature(string $provider, array $headers, string $body): bool
    {
        switch ($provider) {
            case 'twilio':
                return $this->verifyTwilioSignature($headers, $body);
            case 'facebook':
                return $this->verifyFacebookSignature($headers, $body);
            default:
                Log::warning("Unknown provider for webhook verification: {$provider}");
                return false;
        }
    }

    /**
     * Verify Twilio webhook signature
     */
    private function verifyTwilioSignature(array $headers, string $body): bool
    {
        // Implement Twilio signature verification
        // For MVP, we'll skip this but structure is ready
        return true;
    }

    /**
     * Verify Facebook webhook signature
     */
    private function verifyFacebookSignature(array $headers, string $body): bool
    {
        // Implement Facebook signature verification
        // For MVP, we'll skip this but structure is ready
        return true;
    }
}
