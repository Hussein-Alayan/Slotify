<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'client_id',
        'agent_id',
        'business_id',
    ];

    public function messages()
    {
        return $this->hasMany(ConversationMessage::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
