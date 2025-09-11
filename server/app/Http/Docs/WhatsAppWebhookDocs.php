<?php

namespace App\Http\Docs;

/**
 * @OA\Post(
 *     path="/api/v1/webhooks/whatsapp",
 *     summary="Handle incoming WhatsApp webhook from n8n workflows",
 *     tags={"Webhooks"},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="provider", type="string", example="twilio"),
 *             @OA\Property(property="message", type="string", example="Hello from WhatsApp!"),
 *             @OA\Property(property="from", type="string", example="+1234567890"),
 *             @OA\Property(property="to", type="string", example="+0987654321")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Webhook processed successfully"
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Invalid signature"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Webhook processing failed"
 *     )
 * )
 * @OA\Get(
 *     path="/api/v1/webhooks/whatsapp/health",
 *     summary="Health check endpoint for webhook monitoring",
 *     tags={"Webhooks"},
 *     @OA\Response(
 *         response=200,
 *         description="Service is healthy"
 *     )
 * )
 */
class WhatsAppWebhookDocs
{
    // This class exists solely for documentation purposes
}
