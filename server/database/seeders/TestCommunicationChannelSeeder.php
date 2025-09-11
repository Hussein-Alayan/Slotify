<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CommunicationChannel;

class TestCommunicationChannelSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing communication channels to avoid duplicates
        CommunicationChannel::whereIn('business_id', [1, 2])->delete();

        // Communication channels for Business 1 (Elite Hair Salon)
        CommunicationChannel::create([
            'business_id' => 1,
            'channel_type' => 'whatsapp',
            'provider' => 'twilio',
            'business_number' => '+15551234567', // Business 1's WhatsApp number
            'phone_number' => '+15551234567',
            'api_key' => 'test_twilio_key_business_1',
            'token' => 'test_twilio_token_business_1',
            'webhook_url' => 'https://api.twilio.com/whatsapp',
            'status' => 'active',
        ]);

        // Communication channel for your n8n WhatsApp business number (Meta/Facebook)
        CommunicationChannel::create([
            'business_id' => 1, // Link to Elite Hair Salon or change as needed
            'channel_type' => 'whatsapp',
            'provider' => 'facebook',
            'business_number' => '+15551388631',
            'phone_number' => '+15551388631',
            'api_key' => 'test_facebook_key_business_real',
            'token' => 'test_facebook_token_business_real',
            'webhook_url' => 'https://graph.facebook.com/v17.0/whatsapp',
            'status' => 'active',
        ]);

        // Communication channels for Business 2 (AI Test Salon)
        CommunicationChannel::create([
            'business_id' => 2,
            'channel_type' => 'whatsapp',
            'provider' => 'twilio',
            'business_number' => '+15559876543', // Business 2's WhatsApp number
            'phone_number' => '+15559876543',
            'api_key' => 'test_twilio_key_business_2',
            'token' => 'test_twilio_token_business_2',
            'webhook_url' => 'https://api.twilio.com/whatsapp',
            'status' => 'active',
        ]);

        $this->command->info('✅ Created WhatsApp communication channels for businesses 1 and 2');
    }
}
