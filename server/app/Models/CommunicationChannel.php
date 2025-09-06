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
        // New n8n webhook fields
        'webhook_url',
        'provider',
        'business_number',
        'status',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    // Scope for n8n to find active WhatsApp channels
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeWhatsApp($query)
    {
        return $query->where('channel_type', 'whatsapp');
    }

    // Helper method for n8n to find business by incoming phone number
    public static function findBusinessByPhone($phoneNumber)
    {
        return self::where('business_number', $phoneNumber)
            ->orWhere('phone_number', $phoneNumber)
            ->where('channel_type', 'whatsapp')
            ->where('status', 'active')
            ->first();
    }
}
