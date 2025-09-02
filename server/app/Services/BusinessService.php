<?php

namespace App\Services;

use App\Models\Business;
use Illuminate\Support\Facades\DB;

class BusinessService
{
    public function storeOrUpdate($user, array $validated)
    {
        $business = null;
        DB::transaction(function () use ($user, $validated, &$business) {
            $business = $user->business ?? new Business();
            $business->fill($validated);
            $business->save();

            // Save working hours in booking_rules
            $business->bookingRules()->updateOrCreate(
                ['business_id' => $business->id],
                [
                    'hours_of_operation' => $validated['working_hours'],
                ]
            );

            // Save services if provided
            if (!empty($validated['services'])) {
                foreach ($validated['services'] as $service) {
                    $business->services()->updateOrCreate(
                        ['name' => $service['name']],
                        [
                            'duration_minutes' => $service['duration_minutes'],
                            'price' => $service['price'],
                            'description' => $service['description'] ?? null,
                        ]
                    );
                }
            }

            // Save resources if provided
            if (!empty($validated['resources'])) {
                foreach ($validated['resources'] as $resource) {
                    $business->resources()->updateOrCreate(
                        ['name' => $resource['name']],
                        [
                            'type' => $resource['type'],
                            'availability' => $resource['availability'] ?? null,
                        ]
                    );
                }
            }

            // Generate workflow JSON
            $workflow = [
                'business' => $business->toArray(),
                'services' => $business->services()->get()->toArray(),
                'resources' => $business->resources()->get()->toArray(),
                'booking_rules' => $business->bookingRules()->first(),
                'communication_channels' => $business->communicationChannels()->get()->toArray(),
                'clients' => $business->clients()->get()->toArray(),
            ];
            $business->workflow = json_encode($workflow);
            $business->save();
        });
        return $business;
    }
}
