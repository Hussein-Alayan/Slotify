<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestBookingFlowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'conversation_id' => 'required|exists:conversations,id',
            'message' => 'required|string|max:1000',
            'client_id' => 'required|exists:clients,id',
            'business_id' => 'required|exists:businesses,id',
            
            // Optional booking override data (for testing specific scenarios)
            'force_booking_data' => 'nullable|array',
            'force_booking_data.service_id' => 'nullable|exists:services,id',
            'force_booking_data.date' => 'nullable|date|after_or_equal:today',
            'force_booking_data.time' => 'nullable|string',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validate that conversation belongs to the business and client
            $conversationId = $this->input('conversation_id');
            $clientId = $this->input('client_id');
            $businessId = $this->input('business_id');
            
            if ($conversationId && $clientId && $businessId) {
                $conversation = \App\Models\Conversation::where('id', $conversationId)
                    ->where('client_id', $clientId)
                    ->where('business_id', $businessId)
                    ->first();
                    
                if (!$conversation) {
                    $validator->errors()->add('conversation_id', 'Conversation does not belong to the specified client and business.');
                }
            }

            // Validate that client belongs to the business
            if ($clientId && $businessId) {
                $client = \App\Models\Client::where('id', $clientId)
                    ->where('business_id', $businessId)
                    ->first();
                    
                if (!$client) {
                    $validator->errors()->add('client_id', 'Client does not belong to the specified business.');
                }
            }

            // Validate forced booking data if provided
            $forcedServiceId = $this->input('force_booking_data.service_id');
            if ($forcedServiceId && $businessId) {
                $service = \App\Models\Service::where('id', $forcedServiceId)
                    ->where('business_id', $businessId)
                    ->first();
                    
                if (!$service) {
                    $validator->errors()->add('force_booking_data.service_id', 'Service does not belong to the specified business.');
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'conversation_id.exists' => 'The specified conversation does not exist.',
            'client_id.exists' => 'The specified client does not exist.',
            'business_id.exists' => 'The specified business does not exist.',
            'message.max' => 'Message cannot be longer than 1000 characters.',
            'force_booking_data.date.after_or_equal' => 'Booking date must be today or in the future.',
        ];
    }
}
