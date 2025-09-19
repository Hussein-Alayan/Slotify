<?php

namespace App\Services;

use App\Models\Resource;

class ResourceService
{
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
