<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => 'required|date|after_or_equal:today',
            'service_id' => 'nullable|exists:services,id',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Get the business from the route
            $businessId = $this->route('business') ?? $this->route('businessId');
            $serviceId = $this->input('service_id');
            
            // Validate that service belongs to the business (if provided)
            if ($serviceId && $businessId) {
                $service = \App\Models\Service::where('id', $serviceId)
                    ->where('business_id', $businessId)
                    ->first();
                    
                if (!$service) {
                    $validator->errors()->add('service_id', 'Service does not belong to the specified business.');
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'date.after_or_equal' => 'Date must be today or in the future.',
        ];
    }
}
