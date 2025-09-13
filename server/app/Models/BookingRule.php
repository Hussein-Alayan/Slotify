<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BookingRule extends Model
{
    use HasFactory;
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
