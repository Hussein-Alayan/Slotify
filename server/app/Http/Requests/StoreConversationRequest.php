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
        });
    }
}
