<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Business;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first business (assuming we have one from BusinessSeeder)
        $business = Business::first();
        
        if (!$business) {
            $this->command->error('No business found. Please run BusinessSeeder first.');
            return;
        }

        $services = [
            [
                'name' => 'Haircut',
                'description' => 'Professional haircut and styling',
                'duration' => 60, // 1 hour
                'price' => 5000, // $50.00 in cents
                'business_id' => $business->id,
            ],
            [
                'name' => 'Hair Wash',
                'description' => 'Hair washing and conditioning',
                'duration' => 30, // 30 minutes
                'price' => 2500, // $25.00 in cents
                'business_id' => $business->id,
            ],
            [
                'name' => 'Hair Color',
                'description' => 'Hair coloring and treatment',
                'duration' => 120, // 2 hours
                'price' => 8000, // $80.00 in cents
                'business_id' => $business->id,
            ],
            [
                'name' => 'Beard Trim',
                'description' => 'Professional beard trimming',
                'duration' => 30, // 30 minutes
                'price' => 3000, // $30.00 in cents
                'business_id' => $business->id,
            ],
            [
                'name' => 'Full Service',
                'description' => 'Complete haircut, wash, and styling',
                'duration' => 90, // 1.5 hours
                'price' => 7500, // $75.00 in cents
                'business_id' => $business->id,
            ],
            [
                'name' => 'Hair Treatment',
                'description' => 'Deep conditioning and repair treatment',
                'duration' => 45, // 45 minutes
                'price' => 4500, // $45.00 in cents
                'business_id' => $business->id,
            ],
        ];

        foreach ($services as $serviceData) {
            Service::create($serviceData);
            $this->command->info("Created service: {$serviceData['name']}");
        }

        $this->command->info('Service seeding completed successfully!');
    }
}
