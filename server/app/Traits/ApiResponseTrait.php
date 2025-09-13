<?php

namespace App\Traits;

trait ApiResponseTrait
{
	protected function successResponse($data = null, $status = 200)
	{
		return response()->json([
			'success' => true,
			'data' => $data,
		], $status);
	}

	protected function errorResponse($message, $status = 400)
	{
		return response()->json([
			'success' => false,
			'message' => $message,
		], $status);
	}
}
