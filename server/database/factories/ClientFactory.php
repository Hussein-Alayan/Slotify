<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Business;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'business_id' => Business::factory(),
            'name' => $this->faker->name(),
            'phone' => $this->faker->unique()->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'no_show_count' => $this->faker->numberBetween(0, 3),
            'normalized_phone' => $this->faker->unique()->numerify('1##########'),
            'whatsapp_opted_in' => true,
            'last_whatsapp_activity' => now(),
        ];
    }
}
