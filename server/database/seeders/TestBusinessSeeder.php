<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Business;

class TestBusinessSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing businesses to avoid conflicts
        Business::whereIn('id', [1, 2, 3])->delete();

        // Business 3 - Your actual WhatsApp Business test number
        Business::create([
            'id' => 3,
            'name' => 'Test Business 15551388631',
            'industry' => 'Test Industry',
            'contact_email' => 'test15551388631@example.com',
            'contact_phone' => '15551388631',
            'address' => '789 Test Blvd',
            'brand_voice' => 'friendly', 
            'timezone' => 'America/New_York',
            'business_hours' => [
                'mon' => ['start' => '09:00', 'end' => '18:00'],
                'tue' => ['start' => '09:00', 'end' => '18:00'],
                'wed' => ['start' => '09:00', 'end' => '18:00'],
                'thu' => ['start' => '09:00', 'end' => '18:00'],
                'fri' => ['start' => '09:00', 'end' => '18:00'],
                'sat' => ['start' => '10:00', 'end' => '16:00'],
                'sun' => ['closed' => true],
            ],
            'status' => 'active',
        ]);

        $this->command->info('✅ Created business for +15551388631');
    }
}
