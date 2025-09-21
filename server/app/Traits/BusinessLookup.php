<?php

namespace App\Traits;

use App\Models\Business;
use Illuminate\Database\Eloquent\ModelNotFoundException;

trait BusinessLookup
{
    // Find business by ID or throw exception
    // 
    // @param int $businessId
    // @return Business
    // @throws ModelNotFoundException
    protected function findBusinessOrFail(int $businessId): Business
    {
        return Business::findOrFail($businessId);
    }

    // Find business by ID or return null
    // 
    // @param int $businessId
    // @return Business|null
    protected function findBusiness(int $businessId): ?Business
    {
        return Business::find($businessId);
    }

    // Validate business exists and return it, or throw exception with custom message
    // 
    // @param int $businessId
    // @param string|null $customMessage
    // @return Business
    // @throws ModelNotFoundException
    protected function validateBusinessExists(int $businessId, ?string $customMessage = null): Business
    {
        try {
            return Business::findOrFail($businessId);
        } catch (ModelNotFoundException $e) {
            throw new ModelNotFoundException(
                $customMessage ?? "Business not found with ID: {$businessId}"
            );
        }
    }

    // Check if business exists
    // 
    // @param int $businessId
    // @return bool
    protected function businessExists(int $businessId): bool
    {
        return Business::where('id', $businessId)->exists();
    }
}