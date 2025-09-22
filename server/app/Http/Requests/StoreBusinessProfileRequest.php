<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBusinessProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
    return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Business fields
            'name' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'brand_voice' => 'required|in:formal,friendly,playful',

            // Working hours (booking_rules)
            'working_hours' => 'required|array',
            'working_hours.mon' => 'required|array',
            'working_hours.tue' => 'required|array',
            'working_hours.wed' => 'required|array',
            'working_hours.thu' => 'required|array',
            'working_hours.fri' => 'required|array',
            'working_hours.sat' => 'nullable|array',
            'working_hours.sun' => 'nullable|array',

            // Services (optional, for future steps)
            'services' => 'array',
            'services.*.name' => 'required_with:services|string|max:255',
            'services.*.duration_minutes' => 'required_with:services|integer|min:1',
            'services.*.price' => 'required_with:services|numeric|min:0',
            'services.*.description' => 'nullable|string',

            // Resources (optional, for future steps)
            'resources' => 'array',
            'resources.*.type' => 'required_with:resources|in:staff,room,equipment',
            'resources.*.name' => 'required_with:resources|string|max:255',
            'resources.*.availability' => 'nullable|array',
        ];
    }
}
