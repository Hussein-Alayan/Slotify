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

        // Business 1 - Hair Salon
        Business::create([
            'id' => 1,
            'name' => 'Elite Hair Salon',
            'industry' => 'Beauty & Wellness',
            'contact_email' => 'info@elitehair.com',
            'contact_phone' => '555-0001',
            'address' => '123 Main St, Downtown',
            'brand_voice' => 'friendly',
            'timezone' => 'America/New_York',
            'business_hours' => [
                'mon' => ['start' => '09:00', 'end' => '18:00'],
                'tue' => ['start' => '09:00', 'end' => '18:00'],
                'wed' => ['start' => '09:00', 'end' => '18:00'],
                'thu' => ['start' => '09:00', 'end' => '18:00'],
                'fri' => ['start' => '09:00', 'end' => '19:00'],
                'sat' => ['start' => '10:00', 'end' => '16:00'],
                'sun' => ['closed' => true],
            ],
            'status' => 'active',
        ]);

        // Business 2 - AI Test Business (for WhatsApp testing)
        Business::create([
            'id' => 2,
            'name' => 'AI Test Salon',
            'industry' => 'Beauty & Wellness',
            'contact_email' => 'ai-test@example.com',
            'contact_phone' => '555-0002',
            'address' => '456 AI Test Ave',
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

        // Business 3 - For phone number 15551388631
        Business::create([
            'id' => 3,
            'name' => 'Test Business 15551388631',
            'industry' => 'Test Industry',
            'contact_email' => 'test15551388631@example.com',
            'contact_phone' => '15551388631',
            'address' => '789 Test Blvd',
            'brand_voice' => 'formal', 
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

    $this->command->info('✅ Created 3 test businesses with proper hours');
    }
}
