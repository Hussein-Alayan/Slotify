<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessProfileRequest;
use App\Services\BusinessService;

class BusinessController extends Controller
{
    protected $businessService;

    public function __construct(BusinessService $businessService)
    {
        $this->businessService = $businessService;
    }

    public function storeOrUpdate(StoreBusinessProfileRequest $request)
    {
        $validated = $request->validated();
        $user = $request->user();
        $business = $this->businessService->storeOrUpdate($user, $validated);
        if ($business) {
            return response()->json(['success' => true, 'business' => $business->load(['bookingRules', 'services', 'resources'])]);
        } else {
            return response()->json(['success' => false, 'message' => 'Business not found or could not be created.'], 404);
        }
    }
}
