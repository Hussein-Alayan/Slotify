<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreConversationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => 'required|exists:clients,id',
            'business_id' => 'required|exists:businesses,id',
            'agent_id' => 'nullable', // optional AI agent, no table check
        ];
    }
}
