<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Business>
 */
class BusinessFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $businessNames = [
            'Elite Hair Salon',
            'Downtown Barbershop',
            'Wellness Spa Center',
            'Perfect Cut Studio',
            'Beauty Haven Salon'
        ];

        return [
            'name' => $this->faker->randomElement($businessNames),
            'industry' => $this->faker->randomElement(['Beauty & Wellness', 'Healthcare', 'Professional Services']),
            'contact_email' => $this->faker->unique()->safeEmail(),
            'contact_phone' => $this->faker->unique()->phoneNumber(),
            'address' => $this->faker->streetAddress() . ', ' . $this->faker->city() . ', ' . $this->faker->stateAbbr(),
            'brand_voice' => $this->faker->randomElement(['Professional', 'Friendly', 'Luxury', 'Casual']),
            'timezone' => $this->faker->randomElement(['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles']),
            'business_hours' => [
                'monday' => ['open' => '09:00', 'close' => '18:00'],
                'tuesday' => ['open' => '09:00', 'close' => '18:00'],
                'wednesday' => ['open' => '09:00', 'close' => '18:00'],
                'thursday' => ['open' => '09:00', 'close' => '18:00'],
                'friday' => ['open' => '09:00', 'close' => '18:00'],
                'saturday' => ['open' => '10:00', 'close' => '16:00'],
                'sunday' => ['closed' => true],
            ],
            'status' => 'active',
        ];
    }

    /**
     * Create a business specifically for WhatsApp testing
     */
    public function forWhatsAppTesting(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Test Hair Salon',
            'industry' => 'Beauty & Wellness',
            'contact_email' => 'test@salon.com',
            'contact_phone' => '+1987654321',
            'address' => '123 Test Street, New York, NY 10001',
            'timezone' => 'America/New_York',
            'status' => 'active',
        ]);
    }
}
