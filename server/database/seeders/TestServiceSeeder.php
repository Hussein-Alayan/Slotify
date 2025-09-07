<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class TestServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing services to avoid duplicates
        Service::whereIn('business_id', [1, 2])->delete();
        
        // Services for Business 1 (Elite Hair Salon)
        $business1Services = [
            [
                'business_id' => 1,
                'name' => 'Haircut',
                'duration_minutes' => 60,
                'price' => 50.00,
                'description' => 'Professional haircut and styling',
            ],
            [
                'business_id' => 1,
                'name' => 'Hair Wash',
                'duration_minutes' => 30,
                'price' => 25.00,
                'description' => 'Hair washing and conditioning',
            ],
            [
                'business_id' => 1,
                'name' => 'Hair Color',
                'duration_minutes' => 120,
                'price' => 80.00,
                'description' => 'Hair coloring and treatment',
            ],
            [
                'business_id' => 1,
                'name' => 'Beard Trim',
                'duration_minutes' => 30,
                'price' => 30.00,
                'description' => 'Professional beard trimming',
            ],
        ];

        // Services for Business 2 (AI Test Salon)
        $business2Services = [
            [
                'business_id' => 2,
                'name' => 'Haircut',
                'duration_minutes' => 60,
                'price' => 45.00,
                'description' => 'AI Test - Professional haircut',
            ],
            [
                'business_id' => 2,
                'name' => 'Consultation',
                'duration_minutes' => 30,
                'price' => 0.00,
                'description' => 'Free consultation service',
            ],
            [
                'business_id' => 2,
                'name' => 'Full Service',
                'duration_minutes' => 90,
                'price' => 75.00,
                'description' => 'Complete styling package',
            ],
        ];

        // Create all services
        foreach (array_merge($business1Services, $business2Services) as $serviceData) {
            Service::create($serviceData);
        }

        $this->command->info('✅ Created services for businesses 1 and 2');
    }
}
