<?php

namespace App\Traits;

use App\Models\Client;
use App\Exceptions\ClientNotFoundException;

trait ClientLookup
{
    /**
     * Find a client by ID and business, or throw exception if not found.
     */
    public function findClientOrFail($clientId, $businessId)
    {
        $client = Client::where('id', $clientId)
            ->where('business_id', $businessId)
            ->first();

        if (!$client) {
            throw new ClientNotFoundException("Client not found for business ID: {$businessId}");
        }

        return $client;
    }

    /**
     * Find a client by ID and business, returns null if not found.
     */
    public function findClient($clientId, $businessId)
    {
        return Client::where('id', $clientId)
            ->where('business_id', $businessId)
            ->first();
    }

    /**
     * Check if a client exists for a business.
     */
    public function clientExists($clientId, $businessId): bool
    {
        return Client::where('id', $clientId)
            ->where('business_id', $businessId)
            ->exists();
    }

    /**
     * Validate that a client belongs to a business, throw exception if not.
     */
    public function validateClientExists($clientId, $businessId)
    {
        if (!$this->clientExists($clientId, $businessId)) {
            throw new ClientNotFoundException("Client not found for business ID: {$businessId}");
        }
    }
}
