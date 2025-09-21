<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AIBookingController;
use App\Http\Controllers\WhatsAppWebhookController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\VoiceCallController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\BusinessStatsController;

Route::prefix('v1')->group(function () {
	// ===== PUBLIC ROUTES =====
	
	// Authentication routes
	Route::post('/register', [AuthController::class, 'register']);
	Route::post('/login', [AuthController::class, 'login'])->name('login');
	
	// Google Auth routes
	Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
	Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
	
	// Services routes (no auth for testing)
	Route::post('/businesses/{business}/services', [ServiceController::class, 'store']);
	Route::get('/businesses/{business}/services', [ServiceController::class, 'index']);
	Route::patch('/businesses/{business}/services/{service}', [ServiceController::class, 'update']);
	
	// Resources routes (no auth for testing)
	Route::post('/resources/{resource}/services', [ResourceController::class, 'assignServices']);
	Route::get('/businesses/{business}/resources', [ResourceController::class, 'index']);
	Route::post('/businesses/{business}/resources', [ResourceController::class, 'store']);
	Route::patch('/businesses/{business}/resources/{resource}', [ResourceController::class, 'update']);
	Route::delete('/businesses/{business}/resources/{resource}', [ResourceController::class, 'destroy']);
	
	// Absence management routes
	Route::post('/businesses/{business}/resources/{resource}/absent', [ResourceController::class, 'markAbsent']);
	Route::post('/businesses/{business}/resources/{resource}/present', [ResourceController::class, 'markPresent']);
	Route::get('/businesses/{business}/resources/{resource}/absence-impact', [ResourceController::class, 'getAbsenceImpact']);
	Route::get('/businesses/{business}/absent-staff', [ResourceController::class, 'getAbsentStaff']);
	
	// Business stats routes (no auth for testing)
	Route::get('/businesses/{business}/total-services', [BusinessStatsController::class, 'totalServices']);
	Route::get('/businesses/{business}/active-services', [BusinessStatsController::class, 'activeServices']);
	Route::get('/businesses/{business}/total-clients', [BusinessStatsController::class, 'totalClients']);
	Route::get('/businesses/{business}/total-bookings', [BusinessStatsController::class, 'totalBookings']);
	
	// n8n Webhook Routes (no auth required for external webhooks)
	Route::prefix('webhooks')->group(function () {
		Route::post('/whatsapp', [WhatsAppWebhookController::class, 'handleWebhook']);
		Route::get('/whatsapp/health', [WhatsAppWebhookController::class, 'health']);
	});
	
	// Voice Call Assistant routes
	Route::prefix('voice')->group(function () {
		Route::post('/log', [VoiceCallController::class, 'logCall']);
		Route::post('/{id}/transcript', [VoiceCallController::class, 'updateTranscript']);
		Route::post('/{id}/end', [VoiceCallController::class, 'endCall']);
		Route::get('/business-context/{business}', [VoiceCallController::class, 'getBusinessContext']);
	});
	
	// AI processing for n8n workflows (no auth required)
	Route::post('/ai/process-message', [AIBookingController::class, 'processMessage']);
	
	// Business workflow (public access)
	Route::get('/businesses/{business}/workflow', [BusinessController::class, 'workflow']);
	
	// Public businesses list for voice call testing
	Route::get('/businesses/public/list', [BusinessController::class, 'publicList']);
	
	// Public client find-or-create for voice call testing
	Route::post('/businesses/{business}/clients/find-or-create', [ClientController::class, 'findOrCreate']);
	

	
	// ===== AUTHENTICATED ROUTES =====
	Route::middleware('auth:sanctum')->group(function () {
		Route::get('/me', [AuthController::class, 'me']);
		
		// Business Profile setup
		Route::post('/business-profile', [BusinessController::class, 'storeOrUpdate']);
		
		// Business management
		Route::get('/businesses', [BusinessController::class, 'index']);
		Route::get('/businesses/{business}', [BusinessController::class, 'show']);
		
		// Client management
		Route::get('/businesses/{business}/clients', [ClientController::class, 'index']);
		Route::post('/businesses/{business}/clients', [ClientController::class, 'store']);
		Route::get('/businesses/{business}/clients/{client}', [ClientController::class, 'show']);
		Route::put('/businesses/{business}/clients/{client}', [ClientController::class, 'update']);
		Route::delete('/businesses/{business}/clients/{client}', [ClientController::class, 'destroy']);
	});
	
	// ===== CONVERSATION ROUTES =====
	Route::post('/conversations', [ConversationController::class, 'startConversation']);
	Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);
	Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'sendMessage']);
	
	// ===== BOOKING ROUTES =====
	// General booking routes
	Route::post('/bookings', [BookingController::class, 'store']);
	Route::get('/bookings/{booking}', [BookingController::class, 'show']);
	Route::put('/bookings/{booking}', [BookingController::class, 'update']);
	Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);
	
	// Business-specific booking routes
	Route::get('/businesses/{business}/availability', [BookingController::class, 'checkAvailability']);
	Route::get('/resources/availability', [BookingController::class, 'checkResourceAvailability']);
	Route::get('/businesses/{business}/bookings', [BookingController::class, 'getBusinessBookings']);
	Route::get('/businesses/{business}/bookings/by-date', [BookingController::class, 'getBusinessBookingsByDate']);
	Route::post('/businesses/{business}/bookings', [BookingController::class, 'store']);
	
	// Client-specific booking routes
	Route::get('/clients/{client}/bookings', [BookingController::class, 'getClientBookings']);
	Route::delete('/clients/{client}/bookings/next', [BookingController::class, 'cancelClientNextBooking']);
});
