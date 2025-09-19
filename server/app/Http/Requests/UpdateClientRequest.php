<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClientRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $businessId = $this->route('business');
        $clientId = $this->route('client');
        return [
            'name' => 'sometimes|required|string|max:255',
            'phone' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('clients')->where('business_id', $businessId)->ignore($clientId)
            ],
            'email' => [
                'sometimes',
                'nullable',
                'email',
                'max:255',
                Rule::unique('clients')->where('business_id', $businessId)->ignore($clientId)
            ],
            'whatsapp_opted_in' => 'sometimes|boolean',
            'no_show_count' => 'sometimes|integer|min:0',
        ];
    }
}
