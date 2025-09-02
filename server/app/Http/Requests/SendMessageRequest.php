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
            'message' => 'required|string',
            'metadata' => 'nullable|array',
        ];
    }
}
