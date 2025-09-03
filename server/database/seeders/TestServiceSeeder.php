<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class TestServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing services to avoid duplicates
        Service::where('business_id', 1)->delete();
        
        $services = [
            [
                'business_id' => 1,
                'name' => 'Haircut',
                'duration_minutes' => 60, // 60 minutes
                'price' => 50.00, // $50.00
                'description' => 'Professional haircut and styling',
            ],
            [
                'business_id' => 1,
                'name' => 'Hair Wash',
                'duration_minutes' => 30, // 30 minutes
                'price' => 25.00, // $25.00
                'description' => 'Hair washing and conditioning',
            ],
            [
                'business_id' => 1,
                'name' => 'Hair Color',
                'duration_minutes' => 120, // 2 hours
                'price' => 80.00, // $80.00
                'description' => 'Hair coloring and treatment',
            ],
            [
                'business_id' => 1,
                'name' => 'Beard Trim',
                'duration_minutes' => 30, // 30 minutes
                'price' => 30.00, // $30.00
                'description' => 'Professional beard trimming',
            ],
            [
                'business_id' => 1,
                'name' => 'Full Service',
                'duration_minutes' => 90, // 1.5 hours
                'price' => 75.00, // $75.00
                'description' => 'Complete haircut, wash, and styling',
            ],
            [
                'business_id' => 1,
                'name' => 'Consultation',
                'duration_minutes' => 30, // 30 minutes
                'price' => 0.00, // Free consultation
                'description' => 'Free consultation to discuss your needs',
            ],
        ];

        foreach ($services as $serviceData) {
            Service::create($serviceData);
        }
        
        $this->command->info('Created ' . count($services) . ' test services');
    }
}
