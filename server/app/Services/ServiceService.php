<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Service;
use App\Traits\BusinessLookup;

class ServiceService
{
    use BusinessLookup;

    public function createService($businessId, array $data)
    {
        $business = $this->findBusinessOrFail($businessId);
        $data['business_id'] = $business->id;

        // Handle base64 image upload
        if (!empty($data['photo_base64'])) {
            $photoUrl = $this->saveBase64Image($data['photo_base64']);
            if ($photoUrl) {
                $data['photo_url'] = $photoUrl;
            }
            unset($data['photo_base64']);
        }

        return Service::create($data);
    }

    public function updateService($serviceId, array $data)
    {
        $service = Service::findOrFail($serviceId);

        // Handle base64 image upload for update
        if (!empty($data['photo_base64'])) {
            $photoUrl = $this->saveBase64Image($data['photo_base64']);
            if ($photoUrl) {
                $data['photo_url'] = $photoUrl;
            }
            unset($data['photo_base64']);
        }

        $service->update($data);
        return $service;
    }

    public function getServicesByBusiness($businessId)
    {
        $business = $this->findBusinessOrFail($businessId);
        return $business->services;
    }

    protected function saveBase64Image($base64)
    {
        // Extract file extension from base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $base64, $type)) {
            $base64 = substr($base64, strpos($base64, ',') + 1);
            $extension = strtolower($type[1]); // jpg, png, gif
        } else {
            return null;
        }
        $base64 = str_replace(' ', '+', $base64);
        $imageData = base64_decode($base64);
        if ($imageData === false) {
            return null;
        }
        $fileName = 'service_' . uniqid() . '.' . $extension;
        $filePath = storage_path('app/public/services/' . $fileName);
        // Ensure directory exists
        if (!is_dir(dirname($filePath))) {
            mkdir(dirname($filePath), 0755, true);
        }
        file_put_contents($filePath, $imageData);
        // Return public URL
        return asset('storage/services/' . $fileName);
    }
}
