<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    protected $fillable = ['client_id', 'business_id', 'model', 'prompt', 'response', 'confidence'];

    protected $casts = [
        'response' => 'array',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
