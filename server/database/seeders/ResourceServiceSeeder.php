<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Resource;
use App\Models\Service;
use Illuminate\Support\Facades\DB;

class ResourceServiceSeeder extends Seeder
{
    /**
     * Associate resources with services they can perform
     */
    public function run(): void
    {
        $staffResources = Resource::where('type', 'staff')->get();
        $businessIds = $staffResources->pluck('business_id')->unique();
        
        foreach ($businessIds as $businessId) {
            $services = Service::where('business_id', $businessId)->get();
            $staff = $staffResources->where('business_id', $businessId);
            
            foreach ($staff as $resource) {
                foreach ($services as $service) {
                    // Skip some combinations to make the data more realistic
                    // In a real scenario, you'd have more specific logic here
                    if (rand(0, 1) || $staff->count() === 1) {
                        DB::table('resource_service')->insert([
                            'resource_id' => $resource->id,
                            'service_id' => $service->id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }
}