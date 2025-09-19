<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ResourceService;
use App\Traits\ApiResponseTrait;

class ResourceController extends Controller{


    use ApiResponseTrait;
    protected $resourceService;

    public function __construct(ResourceService $resourceService)
    {
        $this->resourceService = $resourceService;
    }

    public function index(Request $request, $businessId)
    {
        try {
            $type = $request->query('type', 'staff');
            $query = \App\Models\Resource::with('services')
                ->where('business_id', $businessId)
                ->where('type', $type);
            $resources = $query->get();
            return $this->successResponse($resources);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function assignServices(Request $request, $resourceId)
    {
        try {
            $result = $this->resourceService->assignServices($resourceId, $request->input('service_ids', []));
            return $this->successResponse($result);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
    public function store(\App\Http\Requests\CreateResourceRequest $request)
    {
        try {
            $resource = $this->resourceService->createStaff($request->validated());
            return $this->successResponse($resource, 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function update(\App\Http\Requests\UpdateResourceRequest $request, $businessId, $resourceId)
    {
        try {
            $resource = $this->resourceService->updateStaff($resourceId, $request->validated());
            return $this->successResponse($resource);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
