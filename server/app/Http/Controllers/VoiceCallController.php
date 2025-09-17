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
     * Return static business context (workflow JSON)
     */
    public function getBusinessContext($businessId)
    {
        $business = \App\Models\Business::findOrFail($businessId);
        $workflow = $business->workflow ? json_decode($business->workflow, true) : [];
        return $this->successResponse(['business_id' => $businessId, 'workflow' => $workflow]);
    }
}
