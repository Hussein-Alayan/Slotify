<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateResourceRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|string|max:255',
            'role' => 'sometimes|nullable|string|max:255',
            'special_skills' => 'sometimes|nullable|string|max:255',
            'availability' => 'sometimes|nullable|array',
            'service_id' => 'sometimes|nullable|integer|exists:services,id',
            'service_ids' => 'sometimes|nullable|array',
            'service_ids.*' => 'integer|exists:services,id',
        ];
    }
}