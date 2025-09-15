<?php

namespace App\Services;

use App\Models\Business;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BusinessContextService
{
    /**
     * Get static business context (cached)
     */
    public function getStaticContext(int $businessId): array
    {
        $cacheKey = "business:{$businessId}:static_context";
        
        return Cache::remember($cacheKey, now()->addHours(24), function () use ($businessId) {
            return $this->generateStaticContext($businessId);
        });
    }
    
    /**
     * Get dynamic business context (real-time)
     */
    public function getDynamicContext(int $businessId, ?string $date = null): array
    {
        $date = $date ?? Carbon::today()->format('Y-m-d');
        return $this->generateDynamicContext($businessId, $date);
    }
    
    /**
     * Get complete business context (static + dynamic)
     */
    public function getCompleteContext(int $businessId, ?string $date = null): array
    {
        $static = $this->getStaticContext($businessId);
        $dynamic = $this->getDynamicContext($businessId, $date);
        
        return array_merge($static, [
            'dynamic_state' => $dynamic
        ]);
    }
    
    /**
     * Get AI-optimized context without duplication
     */
    public function getAIContext(int $businessId, ?string $date = null): array
    {
        // Always get fresh context to ensure we have the latest booking data
        $context = $this->getCompleteContext($businessId, $date);
        
        // Get resources that can perform each service
        $serviceProviders = [];
        foreach ($context['services'] as $service) {
            $resources = \App\Models\Service::find($service['id'])->resources;
            $serviceProviders[$service['name']] = $resources->pluck('name')->toArray();
        }
        
        // Format resource availability for AI consumption
        $resourceAvailability = [];
        foreach ($context['resources'] as $resource) {
            if ($resource['type'] === 'staff') {
                // Get all bookings for this resource, not just for today
                $bookedSlots = \App\Models\Booking::where('resource_id', $resource['id'])
                    ->where('status', 'confirmed')
                    ->whereDate('start_time', '>=', Carbon::today())
                    ->with(['service'])
                    ->get()
                    ->map(function($booking) {
                        return [
                            'date' => Carbon::parse($booking->start_time)->format('Y-m-d'),
                            'start' => Carbon::parse($booking->start_time)->format('H:i'),
                            'end' => Carbon::parse($booking->end_time)->format('H:i'),
                            'service' => optional($booking->service)->name
                        ];
                    })
                    ->values()
                    ->toArray();
                
                $resourceAvailability[$resource['name']] = [
                    'id' => $resource['id'],
                    'type' => $resource['type'],
                    'booked_slots' => $bookedSlots,
                    'services_offered' => \App\Models\Resource::find($resource['id'])->services->pluck('name')->toArray()
                ];
            }
        }
        
        // Only include necessary data and avoid duplications
        return [
            'business' => $context['business'],
            'services' => $context['services'],
            'resources' => $context['resources'],
            'booking_rules' => $context['booking_rules'],
            'resource_availability' => $resourceAvailability,
            'service_providers' => $serviceProviders,
            'booked_slots' => $this->getAllFutureBookings($businessId) // Get all future bookings
        ];
    }
    
    /**
     * Get all future bookings for a business
     */
    private function getAllFutureBookings(int $businessId): array
    {
        return \App\Models\Booking::where('business_id', $businessId)
            ->where('status', 'confirmed')
            ->whereDate('start_time', '>=', Carbon::today())
            ->with(['client', 'service'])
            ->get()
            ->toArray();
    }
    
    /**
     * Check if a resource is available at the specified time
     */
    public function isResourceAvailable(int $resourceId, string $date, string $time, int $durationMinutes = 30): array
    {
        // Convert time to datetime objects
        $startTime = Carbon::parse("$date $time");
        $endTime = $startTime->copy()->addMinutes($durationMinutes);
        
        // Get resource
        $resource = \App\Models\Resource::findOrFail($resourceId);
        $business = \App\Models\Business::findOrFail($resource->business_id);
        
        // 1. Check if business is open
        $dayOfWeek = strtolower($startTime->format('D'));
        $businessHours = $business->business_hours[$dayOfWeek] ?? null;
        
        if (!$businessHours || isset($businessHours['closed']) || empty($businessHours['start']) || empty($businessHours['end'])) {
            return [
                'available' => false,
                'reason' => 'Business is closed on this day'
            ];
        }
        
        // Check if time is within business hours
        $businessOpen = Carbon::parse("$date {$businessHours['start']}");
        $businessClose = Carbon::parse("$date {$businessHours['end']}");
        
        if ($startTime < $businessOpen || $endTime > $businessClose) {
            return [
                'available' => false,
                'reason' => 'Outside business hours'
            ];
        }
        
        // 2. Check for conflicting bookings
        $conflictingBooking = \App\Models\Booking::where('resource_id', $resourceId)
            ->where(function($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<', $startTime)
                          ->where('end_time', '>', $startTime);
                    });
            })
            ->first();
        
        if ($conflictingBooking) {
            return [
                'available' => false,
                'reason' => 'Resource is already booked',
                'conflict' => [
                    'start' => $conflictingBooking->start_time->format('H:i'),
                    'end' => $conflictingBooking->end_time->format('H:i')
                ]
            ];
        }
        
        return [
            'available' => true
        ];
    }
    
    /**
     * Refresh static context (after business updates)
     */
    public function refreshStaticContext(int $businessId): array
    {
        $cacheKey = "business:{$businessId}:static_context";
        Cache::forget($cacheKey);
        
        $context = $this->generateStaticContext($businessId);
        Cache::put($cacheKey, $context, now()->addHours(24));
        
        return $context;
    }
    
    /**
     * Generate static business context
     */
    private function generateStaticContext(int $businessId): array
    {
        $business = Business::with([
            'services', 
            'resources', 
            'bookingRules', 
            'communicationChannels', 
            'clients'
        ])->find($businessId);
        
        if (!$business) {
            Log::error("Business not found: {$businessId}");
            return [];
        }
        
        return [
            'business' => array_diff_key($business->toArray(), [
                'services' => 1, 
                'resources' => 1, 
                'bookingRules' => 1,
                'communicationChannels' => 1,
                'clients' => 1
            ]),
            'services' => $business->services->toArray(),
            'resources' => $business->resources->toArray(),
            'booking_rules' => $business->bookingRules,
            'communication_channels' => $business->communicationChannels->toArray(),
            'clients' => $business->clients->toArray(),
        ];
    }
    
    /**
     * Generate dynamic business context
     */
    private function generateDynamicContext(int $businessId, string $date): array
    {
        // Load business with the minimal relations needed for dynamic data
        $business = Business::with(['resources'])->find($businessId);
        
        if (!$business) {
            Log::error("Business not found for dynamic context: {$businessId}");
            return [];
        }
        
        // Get today's bookings
        $bookings = \App\Models\Booking::where('business_id', $businessId)
            ->whereDate('start_time', $date)
            ->with(['client', 'service'])
            ->get();
        
        // Get resource availability
        $resources = $business->resources;
        $resourceAvailability = [];
        
        foreach ($resources as $resource) {
            // For staff, check their booked slots
            if ($resource->type === 'staff') {
                $resourceBookings = $bookings->where('resource_id', $resource->id);
                $bookedSlots = $resourceBookings->map(function ($booking) {
                    $start = Carbon::parse($booking->start_time);
                    $end = Carbon::parse($booking->end_time);
                    return [
                        'start' => $start->format('H:i'),
                        'end' => $end->format('H:i'),
                        'service_id' => $booking->service_id
                    ];
                });
                
                $resourceAvailability[$resource->id] = [
                    'name' => $resource->name,
                    'type' => $resource->type,
                    'booked_slots' => $bookedSlots->toArray(),
                    'custom_availability' => $resource->availability ?? null
                ];
            } 
            // For physical resources, track availability
            else {
                $resourceAvailability[$resource->id] = [
                    'name' => $resource->name,
                    'type' => $resource->type,
                    'availability' => $resource->availability ?? 'available',
                ];
            }
        }
        
        return [
            'date' => $date,
            'bookings' => $bookings->toArray(),
            'resource_availability' => $resourceAvailability,
        ];
    }
}