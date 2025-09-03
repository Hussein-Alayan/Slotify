<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversationMessage extends Model
{
    protected $fillable = ['conversation_id', 'client_id', 'business_id', 'sender', 'message', 'metadata'];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
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
