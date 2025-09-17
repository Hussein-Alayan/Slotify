<?php

namespace App\Http\Controllers;


use App\Http\Requests\CreateServiceRequest;
use App\Services\ServiceService;
use App\Traits\ApiResponseTrait;


class ServiceController extends Controller
{
    use ApiResponseTrait;

    protected $serviceService;

    public function __construct(ServiceService $serviceService)
    {
        $this->serviceService = $serviceService;
    }

    public function store(CreateServiceRequest $request, $businessId)
    {
        try {
            $service = $this->serviceService->createService($businessId, $request->validated());
            return $this->successResponse($service, 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
