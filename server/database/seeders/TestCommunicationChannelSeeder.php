<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CommunicationChannel;

class TestCommunicationChannelSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing communication channels to avoid duplicates
        CommunicationChannel::whereIn('business_id', [1, 2, 3])->delete();

        // Communication channel for Business 3 (+15551388631) - Your actual WhatsApp test number
        CommunicationChannel::create([
            'business_id' => 3,
            'channel_type' => 'whatsapp',
            'provider' => 'facebook',
            'business_number' => '+15551388631',
            'phone_number' => '+15551388631',
            'api_key' => 'test_facebook_key_business_3',
            'token' => 'test_facebook_token_business_3',
            'webhook_url' => 'https://graph.facebook.com/v17.0/whatsapp',
            'status' => 'active',
        ]);

        $this->command->info('✅ Created WhatsApp communication channel for +15551388631');
    }
}
