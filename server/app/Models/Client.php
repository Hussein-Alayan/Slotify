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
        // New n8n fields
        'normalized_phone',
        'whatsapp_opted_in',
        'last_whatsapp_activity',
    ];

    protected $casts = [
        'whatsapp_opted_in' => 'boolean',
        'last_whatsapp_activity' => 'datetime',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class);
    }

    public function conversationMessages()
    {
        return $this->hasMany(ConversationMessage::class);
    }

    // Scopes for n8n to find clients
    public function scopeByPhone($query, $phoneNumber)
    {
        return $query->where('normalized_phone', $phoneNumber)
            ->orWhere('phone', $phoneNumber);
    }

    public function scopeWhatsAppOptedIn($query)
    {
        return $query->where('whatsapp_opted_in', true);
    }

    public function scopeForBusiness($query, $businessId)
    {
        return $query->where('business_id', $businessId);
    }

    // Helper methods for n8n workflows
    public static function findOrCreateByPhone($businessId, $phoneNumber, $name = null)
    {
        $normalizedPhone = self::normalizePhone($phoneNumber);
        
        $client = self::where('business_id', $businessId)
            ->where('normalized_phone', $normalizedPhone)
            ->first();

        if (!$client) {
            $client = self::create([
                'business_id' => $businessId,
                'name' => $name ?: 'WhatsApp User',
                'phone' => $phoneNumber,
                'normalized_phone' => $normalizedPhone,
                'whatsapp_opted_in' => true,
                'last_whatsapp_activity' => now(),
            ]);
        } else {
            // Update last activity
            $client->update(['last_whatsapp_activity' => now()]);
        }

        return $client;
    }

    public static function normalizePhone($phoneNumber)
    {
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phoneNumber);
        
        // Add country code if missing (assuming +1 for US/CA, adjust as needed)
        if (strlen($phone) === 10 && !str_starts_with($phone, '1')) {
            $phone = '1' . $phone;
        }
        
        return $phone;
    }

    public function updateWhatsAppActivity()
    {
        $this->update(['last_whatsapp_activity' => now()]);
    }
}
