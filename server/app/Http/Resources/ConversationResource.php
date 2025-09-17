<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'client_id' => $this->client_id,
            'business_id' => $this->business_id,
            'agent_id' => $this->agent_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'messages' => $this->whenLoaded('messages', function () {
                return $this->messages->map(function ($msg) {
                    return [
                        'id' => $msg->id,
                        'conversation_id' => $msg->conversation_id,
                        'client_id' => $msg->client_id,
                        'business_id' => $msg->business_id,
                        'sender' => $msg->sender,
                        'message' => $msg->message,
                        'metadata' => $msg->metadata,
                        'created_at' => $msg->created_at,
                        'updated_at' => $msg->updated_at,
                    ];
                });
            }),
        ];
    }
}
