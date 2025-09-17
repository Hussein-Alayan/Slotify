<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Resource extends Model
{
    use HasFactory;
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
    
    public function services()
    {
        return $this->belongsToMany(Service::class);
    }
}
