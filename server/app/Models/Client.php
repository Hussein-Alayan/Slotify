<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'business_id',
        'name',
        'phone',
        'email',
        'no_show_count',
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
