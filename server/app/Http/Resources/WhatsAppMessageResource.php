<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WhatsAppMessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'business' => [
                'id' => $this->resource['business']->id,
                'name' => $this->resource['business']->name,
                'contact_phone' => $this->resource['business']->contact_phone,
                'timezone' => $this->resource['business']->timezone,
                'is_open_now' => $this->resource['business']->isOpenNow(),
            ],
            'client' => [
                'id' => $this->resource['client']->id,
                'name' => $this->resource['client']->name,
                'phone' => $this->resource['client']->phone,
                'normalized_phone' => $this->resource['client']->normalized_phone,
                'last_whatsapp_activity' => $this->resource['client']->last_whatsapp_activity,
            ],
            'conversation' => [
                'id' => $this->resource['conversation']->id,
                'status' => $this->resource['conversation']->status,
                'created_at' => $this->resource['conversation']->created_at,
                'updated_at' => $this->resource['conversation']->updated_at,
            ],
            'message' => [
                'id' => $this->resource['message']->id,
                'content' => $this->resource['message']->message,
                'direction' => $this->resource['message']->direction,
                'source_phone' => $this->resource['message']->source_phone,
                'external_message_id' => $this->resource['message']->external_message_id,
                'created_at' => $this->resource['message']->created_at,
            ],
            'processed_at' => $this->resource['processed_at'],
            
            // Additional metadata for n8n workflows
            'workflow_data' => [
                'business_id' => $this->resource['business']->id,
                'client_id' => $this->resource['client']->id,
                'conversation_id' => $this->resource['conversation']->id,
                'message_id' => $this->resource['message']->id,
                'needs_ai_processing' => true,
                'client_phone_normalized' => $this->resource['client']->normalized_phone,
                'business_is_open' => $this->resource['business']->isOpenNow(),
            ],
            
            // Complete business workflow JSON for n8n
            'business_workflow' => $this->resource['business']->workflow 
                ? json_decode($this->resource['business']->workflow, true) 
                : null,
        ];
    }
}
