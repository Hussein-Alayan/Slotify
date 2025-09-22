<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Services\ServiceService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
class ServiceController extends Controller
{
    use ApiResponseTrait;

    protected $serviceService;

    public function __construct(ServiceService $serviceService)
    {
        $this->serviceService = $serviceService;
    }
    // Get all services for a business
    public function index($businessId): JsonResponse
    {
        try {
            $services = $this->serviceService->getServicesByBusiness($businessId);
            return $this->successResponse($services);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    // Create a new service for a business
    public function store(CreateServiceRequest $request, $businessId): JsonResponse
    {
        try {
            $service = $this->serviceService->createService($businessId, $request->validated());
            return $this->successResponse($service, 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

        // Update an existing service
    public function update(UpdateServiceRequest $request, $businessId, $serviceId)
    {
        try {
            $service = $this->serviceService->updateService($serviceId, $request->validated());
            return $this->successResponse($service);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
