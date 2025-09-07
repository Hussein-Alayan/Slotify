<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BookingRule;

class TestBookingRulesSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing booking rules for businesses 1 and 2
        BookingRule::whereIn('business_id', [1, 2])->delete();

        // Booking rules for Business 1
        BookingRule::create([
            'business_id' => 1,
            'hours_of_operation' => [
                'mon' => ['start' => '09:00', 'end' => '18:00', 'available' => true],
                'tue' => ['start' => '09:00', 'end' => '18:00', 'available' => true],
                'wed' => ['start' => '09:00', 'end' => '18:00', 'available' => true],
                'thu' => ['start' => '09:00', 'end' => '18:00', 'available' => true],
                'fri' => ['start' => '09:00', 'end' => '19:00', 'available' => true],
                'sat' => ['start' => '10:00', 'end' => '16:00', 'available' => true],
                'sun' => ['available' => false],
            ],
            'buffer_time_minutes' => 15,
            'cancellation_policy' => '24 hours advance notice required',
        ]);

        // Booking rules for Business 2 (AI Test)
        BookingRule::create([
            'business_id' => 2,
            'hours_of_operation' => [
                'mon' => ['start' => '09:00', 'end' => '18:00', 'available' => true],
                'tue' => ['start' => '09:00', 'end' => '18:00', 'available' => true],
                'wed' => ['start' => '09:00', 'end' => '18:00', 'available' => true],
                'thu' => ['start' => '09:00', 'end' => '18:00', 'available' => true],
                'fri' => ['start' => '09:00', 'end' => '18:00', 'available' => true],
                'sat' => ['start' => '10:00', 'end' => '16:00', 'available' => true],
                'sun' => ['available' => false],
            ],
            'buffer_time_minutes' => 15,
            'cancellation_policy' => '24 hours advance notice required',
        ]);

        $this->command->info('✅ Created booking rules for businesses 1 and 2');
    }
}
