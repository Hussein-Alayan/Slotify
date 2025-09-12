<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BookingRule;

class TestBookingRulesSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing booking rules for all businesses
        BookingRule::whereIn('business_id', [1, 2, 3])->delete();

        // Booking rules for Business 3 (Test Business 15551388631)
        BookingRule::create([
            'business_id' => 3,
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

        $this->command->info('✅ Created booking rules for business +15551388631');
    }
}
