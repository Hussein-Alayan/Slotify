<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_id' => 'sometimes|exists:services,id',
            'resource_id' => 'sometimes|nullable|exists:resources,id',
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date|after:start_time',
            'status' => 'sometimes|in:confirmed,cancelled,completed,no_show',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Get the booking being updated
            $bookingId = $this->route('booking') ?? $this->route('bookingId');
            if ($bookingId) {
                $booking = \App\Models\Booking::find($bookingId);
                
                if ($booking) {
                    // Validate that service belongs to the business (if provided)
                    $serviceId = $this->input('service_id');
                    if ($serviceId) {
                        $service = \App\Models\Service::where('id', $serviceId)
                            ->where('business_id', $booking->business_id)
                            ->first();
                            
                        if (!$service) {
                            $validator->errors()->add('service_id', 'Service does not belong to this business.');
                        }
                    }

                    // Validate that resource belongs to the business (if provided)
                    $resourceId = $this->input('resource_id');
                    if ($resourceId) {
                        $resource = \App\Models\Resource::where('id', $resourceId)
                            ->where('business_id', $booking->business_id)
                            ->first();
                            
                        if (!$resource) {
                            $validator->errors()->add('resource_id', 'Resource does not belong to this business.');
                        }
                    }
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'end_time.after' => 'Booking end time must be after start time.',
            'status.in' => 'Status must be one of: confirmed, cancelled, completed, no_show.',
        ];
    }
}
