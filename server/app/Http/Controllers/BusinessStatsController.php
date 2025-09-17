<?php

    namespace App\Http\Controllers;

    use App\Models\Business;
    use Illuminate\Http\Request;
    use App\Traits\ApiResponseTrait;

    class BusinessStatsController extends Controller
    {
        use ApiResponseTrait;

        public function totalServices($businessId)
        {
            $business = Business::find($businessId);
            if (!$business) {
                return $this->errorResponse('Business not found.', 404);
            }
            $totalServices = $business->services()->count();
            return $this->successResponse(['total_services' => $totalServices]);
        }

        public function activeServices($businessId)
        {
            $business = Business::find($businessId);
            if (!$business) {
                return $this->errorResponse('Business not found.', 404);
            }
            $activeServices = $business->services()->where('status', 'active')->count();
            return $this->successResponse(['active_services' => $activeServices]);
        }

    public function totalClients($businessId)
    {
        $business = Business::find($businessId);
        if (!$business) {
            return $this->errorResponse('Business not found.', 404);
        }
        $totalClients = $business->clients()->count();
        return $this->successResponse(['total_clients' => $totalClients]);
    }

    public function totalBookings($businessId)
    {
        $business = Business::find($businessId);
        if (!$business) {
            return $this->errorResponse('Business not found.', 404);
        }
        $totalBookings = $business->bookings()->count();
        return $this->successResponse(['total_bookings' => $totalBookings]);
    }
}
