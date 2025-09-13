<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Client;
use App\Models\Business;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'business_id' => Business::factory(),
            'agent_id' => null,
        ];
    }
}
