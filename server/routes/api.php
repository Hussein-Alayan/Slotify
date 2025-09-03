<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\BookingController;

Route::prefix('v1')->group(function () {
	Route::post('/register', [AuthController::class, 'register']);
	Route::post('/login', [AuthController::class, 'login']);

	// Google Auth routes
	Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
	Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

	Route::middleware('auth:sanctum')->group(function () {
		Route::post('/logout', [AuthController::class, 'logout']);
		Route::get('/me', [AuthController::class, 'me']);

		// Business Profile setup
		Route::post('/business-profile', [\App\Http\Controllers\BusinessController::class, 'storeOrUpdate']);

		// Conversation routes
		Route::post('/conversations', [ConversationController::class, 'startConversation']); // start new conversation
		Route::get('/conversations/{conversation}', [ConversationController::class, 'show']); // get conversation messages
		Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'sendMessage']); // store message
	});
});
