<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'business_id' => 'required|exists:businesses,id',
            'client_id' => 'required|exists:clients,id',
            'service_id' => 'required|exists:services,id',
            'resource_id' => 'nullable|exists:resources,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validate that client belongs to the business
            $clientId = $this->input('client_id');
            $businessId = $this->input('business_id');
            
            if ($clientId && $businessId) {
                $client = \App\Models\Client::where('id', $clientId)
                    ->where('business_id', $businessId)
                    ->first();
                    
                if (!$client) {
                    $validator->errors()->add('client_id', 'Client does not belong to the specified business.');
                }
            }

            // Validate that service belongs to the business
            $serviceId = $this->input('service_id');
            if ($serviceId && $businessId) {
                $service = \App\Models\Service::where('id', $serviceId)
                    ->where('business_id', $businessId)
                    ->first();
                    
                if (!$service) {
                    $validator->errors()->add('service_id', 'Service does not belong to the specified business.');
                }
            }

            // Validate that resource belongs to the business (if provided)
            $resourceId = $this->input('resource_id');
            if ($resourceId && $businessId) {
                $resource = \App\Models\Resource::where('id', $resourceId)
                    ->where('business_id', $businessId)
                    ->first();
                    
                if (!$resource) {
                    $validator->errors()->add('resource_id', 'Resource does not belong to the specified business.');
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'start_time.after' => 'Booking start time must be in the future.',
            'end_time.after' => 'Booking end time must be after start time.',
        ];
    }
}
