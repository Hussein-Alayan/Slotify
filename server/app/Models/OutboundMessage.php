<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OutboundMessage extends Model
{
    protected $fillable = [
        'business_id',
        'recipient_phone',
        'message_content',
        'status',
        'external_message_id',
        'error_message',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    // Relationships
    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    // Scopes for n8n to manage message queue
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeForBusiness($query, $businessId)
    {
        return $query->where('business_id', $businessId);
    }

    // Helper methods for n8n workflows
    public function markAsSent($externalMessageId = null)
    {
        $this->update([
            'status' => 'sent',
            'external_message_id' => $externalMessageId,
            'sent_at' => now(),
            'error_message' => null,
        ]);
    }

    public function markAsFailed($errorMessage)
    {
        $this->update([
            'status' => 'failed',
            'error_message' => $errorMessage,
        ]);
    }
}
