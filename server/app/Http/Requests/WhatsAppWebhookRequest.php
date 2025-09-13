<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WhatsAppWebhookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // For webhook endpoints, we handle auth via signature verification
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'from_phone' => 'required|string|max:20',
            'to_phone' => 'required|string|max:20',
            'message_content' => 'required|string|max:4096',
            'from_name' => 'nullable|string|max:255',
            'provider' => 'nullable|string|in:twilio,facebook',
            'external_message_id' => 'nullable|string|max:255',
            'message_type' => 'nullable|string|in:text,image,audio,video,document',
            'timestamp' => 'nullable|date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'from_phone.required' => 'The sender phone number is required.',
            'to_phone.required' => 'The recipient phone number is required.',
            'message_content.required' => 'The message content is required.',
            'message_content.max' => 'The message content cannot exceed 4096 characters.',
            'provider.in' => 'The provider must be either twilio or facebook.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default provider if not provided
        if (!$this->has('provider')) {
            $this->merge(['provider' => 'twilio']);
        }

        // Set default message type if not provided
        if (!$this->has('message_type')) {
            $this->merge(['message_type' => 'text']);
        }

        // Set timestamp if not provided
        if (!$this->has('timestamp')) {
            $this->merge(['timestamp' => now()->toISOString()]);
        }
    }
}
