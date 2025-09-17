<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AIBookingController;
use App\Http\Controllers\WhatsAppWebhookController;

Route::prefix('v1')->group(function () {
	Route::post('/register', [AuthController::class, 'register']);
	Route::post('/login', [AuthController::class, 'login']);

	// Google Auth routes
	Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
	Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

	// n8n Webhook Routes (no auth required for external webhooks)
	Route::prefix('webhooks')->group(function () {
		Route::post('/whatsapp', [WhatsAppWebhookController::class, 'handleWebhook']);
		Route::get('/whatsapp/health', [WhatsAppWebhookController::class, 'health']);
	});

	// AI processing for n8n workflows (no auth required)
	Route::post('/ai/process-message', [AIBookingController::class, 'processMessage']);

	Route::middleware('auth:sanctum')->group(function () {
		Route::get('/me', [AuthController::class, 'me']);

	// Business Profile setup
	Route::post('/business-profile', [\App\Http\Controllers\BusinessController::class, 'storeOrUpdate']);
	// Business stats
	Route::get('/businesses/{business}/total-clients', [\App\Http\Controllers\BusinessStatsController::class, 'totalClients']);
	Route::get('/businesses/{business}/total-bookings', [\App\Http\Controllers\BusinessStatsController::class, 'totalBookings']);

		// Conversation routes
		Route::post('/conversations', [ConversationController::class, 'startConversation']); // start new conversation
		Route::get('/conversations/{conversation}', [ConversationController::class, 'show']); // get conversation messages
		Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'sendMessage']); // store message

		// Booking routes
		Route::post('/bookings', [BookingController::class, 'store']); // create booking
		Route::get('/bookings/{booking}', [BookingController::class, 'show']); // get booking details
		Route::put('/bookings/{booking}', [BookingController::class, 'update']); // update booking
		Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']); // cancel booking
		//use patch to reduce redandancy 
		// Business-specific booking routes
		Route::get('/businesses/{business}/availability', [BookingController::class, 'checkAvailability']); // check availability
		Route::get('/resources/availability', [BookingController::class, 'checkResourceAvailability']); // check resource availability
		Route::get('/businesses/{business}/bookings', [BookingController::class, 'getBusinessBookings']); // get business bookings
		Route::post('/businesses/{business}/bookings', [BookingController::class, 'store']); // create booking for business
		
		// Client-specific booking routes
		Route::get('/clients/{client}/bookings', [BookingController::class, 'getClientBookings']); // get client bookings
	});
});
