<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sender' => 'required|in:user,ai',
            'message' => 'required|string|max:10000',
            'metadata' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'sender.required' => 'The sender field is required.',
            'sender.in' => 'The sender must be either "user" or "ai".',
            'message.required' => 'The message field is required.',
            'message.max' => 'The message may not be greater than 10000 characters.',
        ];
    }
}
