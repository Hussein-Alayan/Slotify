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
            'agent_id' => $this->agent_id,
            'messages' => $this->messages->map(function ($msg) {
                return [
                    'id' => $msg->id,
                    'sender' => $msg->sender,
                    'content' => $msg->content,
                    'created_at' => $msg->created_at,
                ];
            }),
        ];
    }
}
