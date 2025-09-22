<?php

namespace App\Http\Controllers;

use App\Services\ClientService;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class ClientController extends Controller
{
    use ApiResponseTrait;

    protected $clientService;

    public function __construct(ClientService $clientService)
    {
        $this->clientService = $clientService;
    }

    // Display a listing of clients for a business
    public function index(Request $request, $businessId)
    {
        try {
            $clients = $this->clientService->getClients($businessId);
            return $this->successResponse($clients);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Business not found.', 404);
        }
    }

        // Store a newly created client in storage
    public function store(StoreClientRequest $request, $businessId)
    {
        try {
            $client = $this->clientService->createClient($businessId, $request->validated());
            return $this->successResponse($client, 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Business not found.', 404);
        }
    }

    // Display the specified client
    public function show(Request $request, $businessId, $clientId)
    {
        try {
            $client = $this->clientService->getClient($businessId, $clientId);
            if ($client === null) {
                return $this->errorResponse('Client not found.', 404);
            }
            return $this->successResponse($client);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Business not found.', 404);
        }
    }

    // Update the specified client in storage
    public function update(UpdateClientRequest $request, $businessId, $clientId)
    {
        try {
            $client = $this->clientService->updateClient($businessId, $clientId, $request->validated());
            if ($client === null) {
                return $this->errorResponse('Client not found.', 404);
            }
            return $this->successResponse($client);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Business not found.', 404);
        }
    }

    // Remove the specified client
    public function destroy(Request $request, $businessId, $clientId)
    {
        try {
            $result = $this->clientService->deleteClient($businessId, $clientId);
            if ($result === null) {
                return $this->errorResponse('Client not found.', 404);
            }
            if ($result === false) {
                return $this->errorResponse('Cannot delete client with existing bookings', 400);
            }
            return $this->successResponse(['message' => 'Client deleted successfully']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Business not found.', 404);
        }
    }

        // Find existing client by phone or create new one
    public function findOrCreate(Request $request, $business)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20'
        ]);
        
        $client = \App\Models\Client::findOrCreateByPhone(
            $business, 
            $request->phone, 
            $request->name
        );
        
        return $this->successResponse($client);
    }
}