<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BusinessController extends Controller
{
    public function storeOrUpdate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'brand_voice' => 'required|in:formal,friendly,playful',
            'working_hours' => 'required|array',
        ]);

        $user = $request->user();

        // You may want to link business to user, adjust as needed
        $business = $user->business ?? new \App\Models\Business();
        $business->fill($validated);
        $business->save();

        // Save working hours in booking_rules
        $business->bookingRules()->updateOrCreate(
            ['business_id' => $business->id],
            [
                'hours_of_operation' => $validated['working_hours'],
            ]
        );

        return response()->json(['success' => true, 'business' => $business->load('bookingRules')]);
    }
}
