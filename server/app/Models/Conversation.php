<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = [
        'client_id',
        'agent_id',
    ];

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}
