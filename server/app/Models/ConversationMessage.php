<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConversationMessage extends Model
{
    protected $fillable = [
        'conversation_id', 
        'client_id', 
        'business_id', 
        'sender', 
        'message', 
        'metadata',
        // New n8n tracking fields
        'direction',
        'external_message_id',
        'delivery_status',
        'source_phone',
        'destination_phone',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    // Scopes for n8n to filter messages
    public function scopeInbound($query)
    {
        return $query->where('direction', 'inbound');
    }

    public function scopeOutbound($query)
    {
        return $query->where('direction', 'outbound');
    }

    public function scopeFromPhone($query, $phoneNumber)
    {
        return $query->where('source_phone', $phoneNumber);
    }

    public function scopeForBusiness($query, $businessId)
    {
        return $query->where('business_id', $businessId);
    }

    // Helper methods for n8n workflows
    public static function createInboundMessage($conversationId, $clientId, $businessId, $message, $sourcePhone, $externalMessageId = null)
    {
        return self::create([
            'conversation_id' => $conversationId,
            'client_id' => $clientId,
            'business_id' => $businessId,
            'sender' => 'user',
            'direction' => 'inbound',
            'message' => $message,
            'source_phone' => $sourcePhone,
            'external_message_id' => $externalMessageId,
            'delivery_status' => 'delivered', // Inbound messages are already delivered
        ]);
    }

    public static function createOutboundMessage($conversationId, $clientId, $businessId, $message, $destinationPhone)
    {
        return self::create([
            'conversation_id' => $conversationId,
            'client_id' => $clientId,
            'business_id' => $businessId,
            'sender' => 'ai',
            'direction' => 'outbound',
            'message' => $message,
            'destination_phone' => $destinationPhone,
            'delivery_status' => 'pending',
        ]);
    }
}
