<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingRule extends Model
{
    protected $fillable = [
        'business_id',
        'hours_of_operation',
        'buffer_time_minutes',
        'cancellation_policy',
    ];

    protected $casts = [
        'hours_of_operation' => 'array',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
