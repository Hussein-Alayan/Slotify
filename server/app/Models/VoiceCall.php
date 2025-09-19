<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VoiceCall extends Model
{
    protected $fillable = [
        'business_id', 'client_id', 'caller_phone', 'status', 'transcript'
    ];
}
