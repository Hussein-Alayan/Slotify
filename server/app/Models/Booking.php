<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'business_id',
        'client_id',
        'service_id',
        'resource_id',
        'start_time',
        'end_time',
        'status',
        // New n8n tracking fields
        'source',
        'cancellation_reason',
        'cancelled_at',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }

    // Scopes for n8n to filter bookings
    public function scopeWhatsAppBookings($query)
    {
        return $query->where('source', 'whatsapp');
    }

    public function scopeForBusiness($query, $businessId)
    {
        return $query->where('business_id', $businessId);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now())
            ->where('status', 'confirmed');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('start_time', today());
    }

    // Helper methods for n8n workflows
    public static function createWhatsAppBooking($businessId, $clientId, $serviceId, $startTime, $endTime, $resourceId = null)
    {
        return self::create([
            'business_id' => $businessId,
            'client_id' => $clientId,
            'service_id' => $serviceId,
            'resource_id' => $resourceId,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => 'confirmed',
            'source' => 'whatsapp',
        ]);
    }

    public function cancelBooking($reason = null)
    {
        $this->update([
            'status' => 'cancelled',
            'cancellation_reason' => $reason,
            'cancelled_at' => now(),
        ]);
    }

    public function isUpcoming()
    {
        return $this->start_time > now() && $this->status === 'confirmed';
    }

    public function canBeCancelled()
    {
        return $this->isUpcoming();
    }
}
