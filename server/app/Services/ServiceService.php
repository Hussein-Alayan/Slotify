<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Service;

class ServiceService
{
    public function createService($businessId, array $data)
    {
        $business = Business::findOrFail($businessId);
        $data['business_id'] = $business->id;
        return Service::create($data);
    }
}
