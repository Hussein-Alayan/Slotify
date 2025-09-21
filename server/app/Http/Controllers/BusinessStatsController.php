<?php

    namespace App\Http\Controllers;

    use App\Models\Business;
    use Illuminate\Http\Request;
    use App\Traits\ApiResponseTrait;
    use Illuminate\Http\JsonResponse;

    class BusinessStatsController extends Controller
    {
        use ApiResponseTrait;

    /**
     * Get total services count for a business
     */
    public function totalServices(Business $business): JsonResponse
    {
        $totalServices = $business->services()->count();
        return $this->successResponse(['total_services' => $totalServices]);
    }

    /**
     * Get active services count for a business
     */
    public function activeServices(Business $business): JsonResponse
    {
        $activeServices = $business->services()->where('status', 'active')->count();
        return $this->successResponse(['active_services' => $activeServices]);
    }

    /**
     * Get total clients count for a business
     */
    public function totalClients(Business $business): JsonResponse
    {
        $totalClients = $business->clients()->count();
        return $this->successResponse(['total_clients' => $totalClients]);
    }

    /**
     * Get total bookings count for a business
     */
    public function totalBookings(Business $business): JsonResponse
    {
        $totalBookings = $business->bookings()->count();
        return $this->successResponse(['total_bookings' => $totalBookings]);
    }
}
