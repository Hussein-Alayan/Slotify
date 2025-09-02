<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $fillable = [
        'name',
        'industry',
        'contact_email',
        'contact_phone',
        'address',
        'brand_voice',
        'workflow',
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
}
