<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ResourceService;
use App\Traits\ApiResponseTrait;

class ResourceController extends Controller
{
    use ApiResponseTrait;

    protected $resourceService;

    public function __construct(ResourceService $resourceService)
    {
        $this->resourceService = $resourceService;
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
}
