<?php

namespace App\Http\Controllers;

use App\Http\Requests\WhatsAppWebhookRequest;
use App\Http\Resources\WhatsAppMessageResource;
use App\Services\WhatsAppWebhookService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class WhatsAppWebhookController extends Controller
{
    use ApiResponseTrait;

    protected $webhookService;

    public function __construct(WhatsAppWebhookService $webhookService)
    {
        $this->webhookService = $webhookService;
    }

    
     // Handle incoming WhatsApp webhook from n8n workflows
     
        public function handleWebhook(WhatsAppWebhookRequest $request): JsonResponse
    {
        try {
            // Verify webhook signature for security
            $provider = $request->input('provider', 'twilio');
            $isValidSignature = $this->webhookService->verifyWebhookSignature(
                $provider,
                $request->headers->all(),
                $request->getContent()
            );

            if (!$isValidSignature) {
                Log::warning('Invalid webhook signature', [
                    'provider' => $provider,
                    'headers' => $request->headers->all()
                ]);
                
                return $this->errorResponse('Invalid signature', 401);
            }

            // Process the incoming message
            $result = $this->webhookService->processIncomingMessage($request->validated());

            // Return structured response for n8n
            return $this->successResponse(new WhatsAppMessageResource($result));

        } catch (\Exception $e) {
            Log::error('WhatsApp webhook processing failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return $this->errorResponse($e->getMessage(), 500);
        }
    }
    
         
     //Health check endpoint for webhook monitoring
    public function health(): JsonResponse
    {
        return $this->successResponse([
            'status' => 'healthy',
            'service' => 'whatsapp-webhook',
            'timestamp' => now()->toISOString()
        ]);
    }
}
