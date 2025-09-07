<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;

class TestClientSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing clients to avoid duplicates
        Client::whereIn('business_id', [1, 2])->delete();

        // Clients for Business 1 (Elite Hair Salon)
        $business1Clients = [
            [
                'business_id' => 1,
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'phone' => '+1234567890',
            ],
            [
                'business_id' => 1,
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'phone' => '+1234567891',
            ],
        ];

        // Clients for Business 2 (AI Test Salon)
        $business2Clients = [
            [
                'business_id' => 2,
                'name' => 'AI Test Client',
                'email' => 'ai-test@example.com',
                'phone' => '+1234567892',
            ],
            [
                'business_id' => 2,
                'name' => 'WhatsApp User',
                'email' => 'whatsapp@example.com',
                'phone' => '+1234567893',
            ],
        ];

        // Create all clients
        foreach (array_merge($business1Clients, $business2Clients) as $clientData) {
            Client::create($clientData);
        }

        $this->command->info('✅ Created clients for businesses 1 and 2');
    }
}
