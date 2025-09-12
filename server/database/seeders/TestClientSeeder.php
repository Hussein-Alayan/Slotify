<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;

class TestClientSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing clients to avoid duplicates
        Client::whereIn('business_id', [1, 2, 3])->delete();

        // Clients for Business 3 (Test Business 15551388631)
        $business3Clients = [
            [
                'business_id' => 3,
                'name' => 'Test Client',
                'email' => 'test.client@example.com',
                'phone' => '+96170653458',
            ],
            [
                'business_id' => 3,
                'name' => 'WhatsApp Tester',
                'email' => 'whatsapp.tester@example.com',
                'phone' => '+1234567894',
            ],
        ];

        // Create clients for Business 3
        foreach ($business3Clients as $clientData) {
            Client::create($clientData);
        }

        $this->command->info('✅ Created test clients for business +15551388631');
    }
}
