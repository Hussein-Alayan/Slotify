<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class TestServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Create some test services for business_id = 1
        Service::create([
            'business_id' => 1,
            'name' => 'Haircut',
            'duration' => 60, // 60 minutes
            'price' => 3000, // $30.00 in cents
            'description' => 'Professional haircut service',
        ]);

        Service::create([
            'business_id' => 1,
            'name' => 'Hair Styling',
            'duration' => 90, // 90 minutes  
            'price' => 5000, // $50.00 in cents
            'description' => 'Complete hair styling service',
        ]);

        Service::create([
            'business_id' => 1,
            'name' => 'Consultation',
            'duration' => 30, // 30 minutes
            'price' => 0, // Free consultation
            'description' => 'Free consultation to discuss your needs',
        ]);
    }
}
