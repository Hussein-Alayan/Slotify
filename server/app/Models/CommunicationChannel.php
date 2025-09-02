<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunicationChannel extends Model
{
    protected $fillable = [
        'business_id',
        'channel_type',
        'api_key',
        'token',
        'phone_number',
        'email',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
