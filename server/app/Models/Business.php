<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'industry',
        'contact_email',
        'contact_phone',
        'address',
        'brand_voice',
        'workflow',
        // New n8n fields
        'timezone',
        'business_hours',
        'status',
    ];

    protected $casts = [
        'business_hours' => 'array',
    ];

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function resources()
    {
        return $this->hasMany(Resource::class);
    }

    public function bookingRules()
    {
        return $this->hasOne(BookingRule::class);
    }

    public function communicationChannels()
    {
        return $this->hasMany(CommunicationChannel::class);
    }

    public function clients()
    {
        return $this->hasMany(Client::class);
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

    public function outboundMessages()
    {
        return $this->hasMany(OutboundMessage::class);
    }

    // Scopes for n8n to filter businesses
    public function scopeActive($query)
    {
        return $this->where('status', 'active');
    }

    public function scopeWithWhatsApp($query)
    {
        return $query->whereHas('communicationChannels', function ($q) {
            $q->where('channel_type', 'whatsapp')->where('status', 'active');
        });
    }

    // Helper methods for n8n workflows
    public function getWhatsAppChannel()
    {
        return $this->communicationChannels()
            ->where('channel_type', 'whatsapp')
            ->where('status', 'active')
            ->first();
    }

    public function isOpenNow($timezone = null)
    {
        if (!$this->business_hours) {
            return true; // Default to open if no hours set
        }

        $tz = $timezone ?: $this->timezone ?: 'UTC';
        $now = now($tz);
        $dayOfWeek = strtolower($now->format('D')); // mon, tue, etc.

        $todayHours = $this->business_hours[$dayOfWeek] ?? null;
        if (!$todayHours || isset($todayHours['closed']) && $todayHours['closed']) {
            return false;
        }

        $start = $todayHours['start'] ?? '00:00';
        $end = $todayHours['end'] ?? '23:59';
        $currentTime = $now->format('H:i');

        return $currentTime >= $start && $currentTime <= $end;
    }
}
