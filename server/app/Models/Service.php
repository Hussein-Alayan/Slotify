<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;
    protected $fillable = [
        'business_id',
        'name',
        'duration_minutes',
        'price',
        'description',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    
    public function resources()
    {
        return $this->belongsToMany(Resource::class);
    }
}
