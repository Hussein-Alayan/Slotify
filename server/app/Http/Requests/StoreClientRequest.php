<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $businessId = $this->route('business');
        return [
            'name' => 'required|string|max:255',
            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('clients')->where('business_id', $businessId)
            ],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('clients')->where('business_id', $businessId)
            ],
            'whatsapp_opted_in' => 'boolean',
        ];
    }
}
