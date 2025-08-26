<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::prefix('v1')->group(function () {
	Route::post('/register', [AuthController::class, 'register']);
	Route::post('/login', [AuthController::class, 'login']);

	// Google Auth routes
	Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
	Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

	Route::middleware('auth:sanctum')->group(function () {
		Route::post('/logout', [AuthController::class, 'logout']);
		Route::get('/me', [AuthController::class, 'me']);
	});
});
