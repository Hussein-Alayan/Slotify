<?php
namespace App\Http\Controllers;

use App\Services\VoiceCallService;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;

class VoiceCallController extends Controller
{
    use ApiResponseTrait;

    protected $voiceCallService;

    public function __construct(VoiceCallService $voiceCallService)
    {
        $this->voiceCallService = $voiceCallService;
    }

    public function logCall(Request $request)
    {
        $call = $this->voiceCallService->logCall([
            'business_id' => $request->business_id ?? null,
            'client_id'   => $request->client_id ?? null,
            'caller_phone'=> $request->caller_phone,
        ]);
        return $this->successResponse(['call_id' => $call->id]);
    }

    public function updateTranscript(Request $request, $id)
    {
        $this->voiceCallService->updateTranscript($id, $request->transcript);
        return $this->successResponse();
    }

    public function endCall($id)
    {
        $this->voiceCallService->endCall($id);
        return $this->successResponse();
    }
    /**
     * Return static business context with current live data
     */
    public function getBusinessContext($businessId)
    {
        $business = \App\Models\Business::with([
            'services' => function($query) {
                $query->where('status', 'active');
            },
            'resources',
            'bookingRules'
        ])->findOrFail($businessId);

        // Build workflow with current live data
        $workflow = [
            'business' => [
                'id' => $business->id,
                'name' => $business->name,
                'industry' => $business->industry,
                'contact_email' => $business->contact_email,
                'contact_phone' => $business->contact_phone,
                'address' => $business->address,
                'brand_voice' => $business->brand_voice,
                'created_at' => $business->created_at,
                'updated_at' => $business->updated_at,
                'timezone' => $business->timezone,
                'business_hours' => $business->business_hours,
                'status' => $business->status,
                'user_id' => $business->user_id,
                'booking_rules' => $business->bookingRules,
            ],
            'services' => $business->services->toArray(), // Current active services only
            'resources' => $business->resources->toArray(),
            'booking_rules' => $business->bookingRules,
        ];

        return $this->successResponse(['business_id' => $businessId, 'workflow' => $workflow]);
    }
}
