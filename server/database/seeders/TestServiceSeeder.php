<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class TestServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing services to avoid duplicates
        Service::whereIn('business_id', [1, 2, 3])->delete();
        
        // Services for Business 3 (Test Business 15551388631)
        $business3Services = [
            [
                'business_id' => 3,
                'name' => 'General Consultation',
                'duration_minutes' => 30,
                'price' => 25.00,
                'description' => 'General business consultation',
            ],
            [
                'business_id' => 3,
                'name' => 'Premium Service',
                'duration_minutes' => 60,
                'price' => 50.00,
                'description' => 'Premium service offering',
            ],
            [
                'business_id' => 3,
                'name' => 'Extended Package',
                'duration_minutes' => 90,
                'price' => 75.00,
                'description' => 'Extended service package',
            ],
        ];

        // Create services for Business 3
        foreach ($business3Services as $serviceData) {
            Service::create($serviceData);
        }

        $this->command->info('✅ Created services for business +15551388631');
    }
}
