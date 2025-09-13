<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\Business;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        return [
            'business_id' => Business::factory(),
            'name' => $this->faker->randomElement(['General Consultation', 'Premium Service', 'Extended Package']),
            'duration_minutes' => $this->faker->randomElement([30, 60, 90]),
            'price' => $this->faker->randomFloat(2, 20, 100),
            'description' => $this->faker->sentence(6),
        ];
    }
}
