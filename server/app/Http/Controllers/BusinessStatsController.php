<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;

class BusinessStatsController extends Controller
{
    use ApiResponseTrait;

    public function totalClients($businessId)
    {
        $business = Business::find($businessId);
        if (!$business) {
            return $this->errorResponse('Business not found.', 404);
        }
        $totalClients = $business->clients()->count();
        return $this->successResponse(['total_clients' => $totalClients]);
    }
}
