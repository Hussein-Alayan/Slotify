<?php


namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessProfileRequest;
use App\Services\BusinessService;
use App\Traits\ApiResponseTrait;

class BusinessController extends Controller
{
    use ApiResponseTrait;

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
            return $this->successResponse($business->load(['bookingRules', 'services', 'resources']));
        } else {
            return $this->errorResponse('Business not found or could not be created.', 404);
        }
    }
}
