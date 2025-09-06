<?php

namespace Database\Factories;

use App\Models\Business;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CommunicationChannel>
 */
class CommunicationChannelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'business_id' => Business::factory(),
            'type' => $this->faker->randomElement(['whatsapp', 'sms', 'email']),
            'business_number' => $this->faker->unique()->phoneNumber(),
            'provider' => $this->faker->randomElement(['twilio', 'facebook']),
            'webhook_url' => 'http://localhost:8000/api/v1/webhooks/whatsapp',
            'is_active' => true,
        ];
    }

    /**
     * Create WhatsApp channel for testing
     */
    public function whatsapp(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'whatsapp',
            'business_number' => '+1987654321',
            'provider' => 'twilio',
        ]);
    }
}
