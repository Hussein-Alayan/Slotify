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

        // Assign service(s) if provided
        if (isset($data['service_id'])) {
            $resource->services()->sync([$data['service_id']]);
        } elseif (isset($data['service_ids']) && is_array($data['service_ids'])) {
            $resource->services()->sync($data['service_ids']);
        }

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

    public function updateStaff($resourceId, array $data)
    {
        $resource = Resource::findOrFail($resourceId);
        
        if ($resource->type !== 'staff') {
            throw new \Exception('Only staff resources can be updated via this method.');
        }

        // Update only provided fields
        $updateData = [];
        if (isset($data['name'])) $updateData['name'] = $data['name'];
        if (isset($data['role'])) $updateData['role'] = $data['role'];
        if (isset($data['special_skills'])) $updateData['special_skills'] = $data['special_skills'];
        if (isset($data['availability'])) $updateData['availability'] = $data['availability'];

        $resource->update($updateData);

        // Update services if provided
        if (isset($data['service_id'])) {
            $resource->services()->sync([$data['service_id']]);
        } elseif (isset($data['service_ids']) && is_array($data['service_ids'])) {
            $resource->services()->sync($data['service_ids']);
        }

        // Load services relationship for response
        $resource->load('services');
        
        return $resource;
    }
}
