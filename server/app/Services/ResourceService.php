<?php

namespace App\Services;

use App\Models\Resource;

class ResourceService
{
    public function createStaff(array $data)
    {
        // Only allow type 'staff' for staff creation
        $data['type'] = 'staff';
        $resource = Resource::create([
            'business_id'    => $data['business_id'],
            'type'           => $data['type'],
            'name'           => $data['name'],
            'role'           => $data['role'] ?? null,
            'special_skills' => $data['special_skills'] ?? null,
            'availability'   => $data['availability'] ?? null,
        ]);
        return $resource;
    }
    public function assignServices($resourceId, array $serviceIds)
    {
        $resource = Resource::findOrFail($resourceId);
        if ($resource->type !== 'staff') {
            throw new \Exception('Only staff can be assigned services.');
        }
        $resource->services()->sync($serviceIds);
        return ['success' => true];
    }
}
