<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessProfileRequest;
use App\Models\Business;
use App\Services\BusinessService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    use ApiResponseTrait;

    protected $businessService;

    public function __construct(BusinessService $businessService)
    {
        $this->businessService = $businessService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $businesses = $this->businessService->getUserBusinesses($user);
        return $this->successResponse($businesses);
    }

    public function show(Request $request, Business $business)
    {
        $user = $request->user();
        
        if ($business->user_id !== $user->id) {
            return $this->errorResponse('Unauthorized', 403);
        }
        
        return $this->successResponse($business->load(['bookingRules', 'services', 'resources']));
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

    public function workflow(Request $request, Business $business)
    {
        return $this->successResponse(json_decode($business->workflow, true));
    }

    public function publicList(Request $request)
    {
        // Get all businesses with just id and name for public dropdown
        $businesses = Business::select('id', 'name')->get();
        return $this->successResponse($businesses);
    }
}
