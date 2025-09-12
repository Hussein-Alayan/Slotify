<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunicationChannel extends Model
{
    use HasFactory;
    protected $fillable = [
        'business_id',
        'channel_type',
        'api_key',
        'token',
        'phone_number',
        'email',
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
        return self::with('business')->where(function($query) use ($phoneNumber) {
                $query->where('business_number', $phoneNumber)
                      ->orWhere('phone_number', $phoneNumber)
                      // Also check with + prefix for normalized numbers
                      ->orWhere('business_number', '+' . $phoneNumber)
                      ->orWhere('phone_number', '+' . $phoneNumber);
            })
            ->where('channel_type', 'whatsapp')
            ->where('status', 'active')
            ->first();
    }
}
