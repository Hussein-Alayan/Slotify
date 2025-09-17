<?php

namespace Database\Factories;

use App\Models\BookingRule;
use App\Models\Business;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingRuleFactory extends Factory
{
    protected $model = BookingRule::class;

    public function definition(): array
    {
        return [
            'business_id' => Business::factory(),
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
        ];
    }
}
