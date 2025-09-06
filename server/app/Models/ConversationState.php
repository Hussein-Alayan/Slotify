<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversationState extends Model
{
    protected $fillable = [
        'client_id',
        'business_id',
        'state',
    ];

    protected $casts = [
        'state' => 'array',
    ];

    public $timestamps = false; // since we use last_updated instead
}

