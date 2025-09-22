<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'business_id' => $this->business_id,
            'client_id' => $this->client_id,
            'service_id' => $this->service_id,
            'resource_id' => $this->resource_id,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Include related models when loaded
            'business' => $this->whenLoaded('business', function () {
                return [
                    'id' => $this->business->id,
                    'name' => $this->business->name,
                    'contact_email' => $this->business->contact_email,
                    'contact_phone' => $this->business->contact_phone,
                ];
            }),
            
            'client' => $this->whenLoaded('client', function () {
                return [
                    'id' => $this->client->id,
                    'name' => $this->client->name,
                    'email' => $this->client->email,
                    'phone' => $this->client->phone,
                ];
            }),
            
            'service' => $this->whenLoaded('service', function () {
                return [
                    'id' => $this->service->id,
                    'name' => $this->service->name,
                    'duration' => $this->service->duration,
                    'price' => $this->service->price,
                ];
            }),
            
            'resource' => $this->whenLoaded('resource', function () {
                $staffMember = $this->getRelation('resource');
                return [
                    'id' => $staffMember->id,
                    'name' => $staffMember->name,
                    'type' => $staffMember->type,
                ];
            }),
        ];
    }
}
