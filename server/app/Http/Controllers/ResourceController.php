<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ResourceService;
use App\Services\StaffReassignmentService;
use App\Traits\ApiResponseTrait;
use App\Models\Business;
use App\Models\Resource;
use Carbon\Carbon;

class ResourceController extends Controller
{
    use ApiResponseTrait;
    protected $resourceService;
    protected $staffReassignmentService;

    public function __construct(ResourceService $resourceService, StaffReassignmentService $staffReassignmentService)
    {
        $this->resourceService = $resourceService;
        $this->staffReassignmentService = $staffReassignmentService;
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

    public function destroy(Business $business, Resource $resource)
    {
        try {
            if ($resource->business_id !== $business->id) {
                return $this->errorResponse('Resource does not belong to this business', 403);
            }

            $result = $this->resourceService->deleteStaff($resource->id);
            return $this->successResponse($result);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Mark staff member as absent and handle booking reassignments
     */
    public function markAbsent(Request $request, $businessId, $resourceId)
    {
        try {
            $request->validate([
                'reason' => 'required|string|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            $staff = Resource::where('id', $resourceId)
                ->where('business_id', $businessId)
                ->where('type', 'staff')
                ->firstOrFail();

            $startDate = $request->start_date ? Carbon::parse($request->start_date) : null;
            $endDate = $request->end_date ? Carbon::parse($request->end_date) : null;

            $result = $this->staffReassignmentService->markStaffAbsent(
                $staff,
                $request->reason,
                $startDate,
                $endDate
            );

            return $this->successResponse($result);

        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Mark staff member as present/available
     */
    public function markPresent(Request $request, $businessId, $resourceId)
    {
        try {
            $staff = Resource::where('id', $resourceId)
                ->where('business_id', $businessId)
                ->where('type', 'staff')
                ->firstOrFail();

            $this->staffReassignmentService->markStaffPresent($staff);

            return $this->successResponse([
                'message' => 'Staff member marked as present',
                'staff' => $staff->fresh()
            ]);

        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Get absence impact summary for a staff member
     */
    public function getAbsenceImpact(Request $request, $businessId, $resourceId)
    {
        try {
            $staff = Resource::where('id', $resourceId)
                ->where('business_id', $businessId)
                ->where('type', 'staff')
                ->firstOrFail();

            $startDate = $request->start_date ? Carbon::parse($request->start_date) : null;
            $endDate = $request->end_date ? Carbon::parse($request->end_date) : null;

            $impact = $this->staffReassignmentService->getAbsenceImpactSummary(
                $staff,
                $startDate,
                $endDate
            );

            return $this->successResponse($impact);

        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Get all absent staff for a business
     */
    public function getAbsentStaff($businessId)
    {
        try {
            $absentStaff = Resource::where('business_id', $businessId)
                ->where('type', 'staff')
                ->absent()
                ->with('services')
                ->get();

            return $this->successResponse($absentStaff);

        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
