<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = [
        'business_id',
        'type',
        'name',
        'availability',
    ];

    protected $casts = [
        'availability' => 'array',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
