<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcessAIMessageRequest extends FormRequest
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
            
            // Optional booking override data (for testing specific scenarios or manual booking details)
            'force_booking_data' => 'nullable|array',
            'force_booking_data.service_id' => 'nullable|exists:services,id',
            'force_booking_data.date' => 'nullable|date|after_or_equal:today',
            'force_booking_data.time' => 'nullable|string',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Get the conversation and validate that it belongs to the client
            $conversationId = $this->input('conversation_id');
            $clientId = $this->input('client_id');
            
            if ($conversationId && $clientId) {
                $conversation = \App\Models\Conversation::where('id', $conversationId)
                    ->where('client_id', $clientId)
                    ->first();
                    
                if (!$conversation) {
                    $validator->errors()->add('conversation_id', 'Conversation does not belong to the specified client.');
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'conversation_id.exists' => 'The specified conversation does not exist.',
            'client_id.exists' => 'The specified client does not exist.',
            'message.max' => 'Message cannot be longer than 1000 characters.',
            'force_booking_data.date.after_or_equal' => 'Booking date must be today or in the future.',
        ];
    }
}
