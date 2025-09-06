<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BookingRule;

class TestBookingRulesSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing booking rules for business 6
        BookingRule::where('business_id', 6)->delete();

        // Create booking rules for business 6 with JSON format
        BookingRule::create([
            'business_id' => 6,
            'hours_of_operation' => [
                'Monday' => ['start' => '09:00', 'end' => '17:00', 'available' => true],
                'Tuesday' => ['start' => '09:00', 'end' => '17:00', 'available' => true],
                'Wednesday' => ['start' => '09:00', 'end' => '17:00', 'available' => true],
                'Thursday' => ['start' => '09:00', 'end' => '17:00', 'available' => true],
                'Friday' => ['start' => '09:00', 'end' => '17:00', 'available' => true],
                'Saturday' => ['start' => '10:00', 'end' => '16:00', 'available' => true],
                'Sunday' => ['available' => false],
            ],
            'buffer_time_minutes' => 15,
            'cancellation_policy' => '24 hours advance notice required',
        ]);

        $this->command->info('Created booking rules for business 1');
    }
}
