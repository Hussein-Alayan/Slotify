<?php

namespace App\Traits;

use App\Models\Service;
use App\Exceptions\ServiceNotFoundException;

trait ServiceLookup
{
    // Find a service by ID and business, or throw exception if not found.
    public function findServiceOrFail($serviceId, $businessId)
    {
        $service = Service::where('id', $serviceId)
            ->where('business_id', $businessId)
            ->first();

        if (!$service) {
            throw new ServiceNotFoundException("Service not found for business ID: {$businessId}");
        }

        return $service;
    }

    // Find a service by ID (without business constraint), or throw exception if not found.
    public function findServiceByIdOrFail($serviceId)
    {
        $service = Service::find($serviceId);

        if (!$service) {
            throw new ServiceNotFoundException("Service not found with ID: {$serviceId}");
        }

        return $service;
    }

    // Find a service by ID and business, returns null if not found.
    public function findService($serviceId, $businessId)
    {
        return Service::where('id', $serviceId)
            ->where('business_id', $businessId)
            ->first();
    }

    // Check if a service exists for a business.
    public function serviceExists($serviceId, $businessId): bool
    {
        return Service::where('id', $serviceId)
            ->where('business_id', $businessId)
            ->exists();
    }

    // Validate that a service belongs to a business, throw exception if not.
    public function validateServiceExists($serviceId, $businessId)
    {
        if (!$this->serviceExists($serviceId, $businessId)) {
            throw new ServiceNotFoundException("Service not found for business ID: {$businessId}");
        }
    }
}