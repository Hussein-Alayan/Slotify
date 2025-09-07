<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Service;

class BookingConfigService
{
    /**
     * Get default booking duration for a service
     */
    public function getDefaultDuration(int $serviceId): int
    {
        $service = Service::find($serviceId);
        return $service ? $service->duration_minutes : 60;
    }

    /**
     * Get default booking time for a business
     */
    public function getDefaultBookingTime(int $businessId): string
    {
        $business = Business::find($businessId);
        
        // Check if business has configured default booking time
        if ($business && isset($business->business_hours)) {
            $hours = $business->business_hours;
            
            // Find first available day and use start time + 2 hours as default
            foreach (['mon', 'tue', 'wed', 'thu', 'fri'] as $day) {
                if (isset($hours[$day]) && !($hours[$day]['closed'] ?? false)) {
                    $startTime = $hours[$day]['start'] ?? '09:00';
                    $defaultHour = intval(substr($startTime, 0, 2)) + 2;
                    return sprintf('%02d:00', min($defaultHour, 17)); // Cap at 5 PM
                }
            }
        }
        
        return '15:00'; // Final fallback
    }

    /**
     * Get default booking date preference for a business
     */
    public function getDefaultBookingDate(int $businessId): string
    {
        // For now, return 'tomorrow' but this could be business-configurable
        return 'tomorrow';
    }

    /**
     * Get AI confidence threshold for a business
     */
    public function getConfidenceThreshold(int $businessId): float
    {
        $business = Business::find($businessId);
        
        // Could be stored in business table or booking_rules
        if ($business && $business->bookingRules) {
            // If you add an ai_confidence_threshold field to booking_rules table
            // return $business->bookingRules->ai_confidence_threshold ?? 0.7;
        }
        
        return 0.7; // Higher than current 0.5 for better accuracy
    }

    /**
     * Get default appointment duration when service is not specified
     */
    public function getDefaultAppointmentDuration(int $businessId): int
    {
        $business = Business::findOrFail($businessId);
        
        // Use the most common service duration
        $commonDuration = $business->services()
            ->selectRaw('duration_minutes, COUNT(*) as count')
            ->groupBy('duration_minutes')
            ->orderBy('count', 'desc')
            ->first();
            
        return $commonDuration ? $commonDuration->duration_minutes : 60;
    }

    /**
     * Get business timezone for proper datetime handling
     */
    public function getBusinessTimezone(int $businessId): string
    {
        $business = Business::find($businessId);
        return $business ? ($business->timezone ?? 'UTC') : 'UTC';
    }
}
