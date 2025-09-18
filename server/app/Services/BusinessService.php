<?php

namespace App\Services;

use App\Models\Business;
use Illuminate\Support\Facades\DB;

class BusinessService
{
    protected $contextService;

    public function __construct(BusinessContextService $contextService)
    {
        $this->contextService = $contextService;
    }

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
                            'role' => $resource['role'] ?? null,
                            'special_skills' => $resource['specialSkills'] ?? null,
                        ]
                    );
                }
            }

            // Generate and cache static context
            $staticContext = $this->contextService->refreshStaticContext($business->id);
            $business->workflow = json_encode($staticContext);
            $business->save();
        });
        return $business;
    }
}
