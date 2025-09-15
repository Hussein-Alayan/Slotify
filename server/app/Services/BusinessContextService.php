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
            'business' => $business->toArray(),
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
            ->whereDate('scheduled_at', $date)
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
                    $start = Carbon::parse($booking->scheduled_at);
                    $end = $start->copy()->addMinutes($booking->duration_minutes);
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