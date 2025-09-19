<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateResourceRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'type' => 'required|in:staff,room,equipment',
            'role' => 'nullable|string|max:255',
            'special_skills' => 'nullable|string|max:255',
            'availability' => 'nullable|array',
            'business_id' => 'required|exists:businesses,id',
            'service_id' => 'nullable|integer|exists:services,id',
            'service_ids' => 'nullable|array',
            'service_ids.*' => 'integer|exists:services,id',
        ];
    }
}
