<?php

    namespace App\Http\Controllers;

    use App\Models\Business;
    use Illuminate\Http\Request;
    use App\Traits\ApiResponseTrait;

    class BusinessStatsController extends Controller
    {
        use ApiResponseTrait;

    public function totalServices(Business $business)
    {
        $totalServices = $business->services()->count();
        return $this->successResponse(['total_services' => $totalServices]);
    }    public function activeServices(Business $business)
    {
        $activeServices = $business->services()->where('status', 'active')->count();
        return $this->successResponse(['active_services' => $activeServices]);
    }    public function totalClients(Business $business)
    {
        $totalClients = $business->clients()->count();
        return $this->successResponse(['total_clients' => $totalClients]);
    }

    public function totalBookings(Business $business)
    {
        $totalBookings = $business->bookings()->count();
        return $this->successResponse(['total_bookings' => $totalBookings]);
    }
}
