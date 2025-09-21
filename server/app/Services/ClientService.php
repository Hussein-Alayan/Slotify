<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Client;
use App\Traits\BusinessLookup;
use Illuminate\Validation\Rule;

class ClientService
{
    use BusinessLookup;

    public function getClients($businessId)
    {
        $business = $this->findBusiness($businessId);
        if (!$business) {
            return null;
        }
        return $business->clients()->with(['bookings'])->orderBy('created_at', 'desc')->get();
    }

    public function createClient($businessId, array $data)
    {
        $business = $this->findBusiness($businessId);
        if (!$business) {
            return null;
        }
        $data['business_id'] = $businessId;
        $data['normalized_phone'] = Client::normalizePhone($data['phone']);
        $data['whatsapp_opted_in'] = $data['whatsapp_opted_in'] ?? false;
        return Client::create($data);
    }

    public function getClient($businessId, $clientId)
    {
        $business = $this->findBusiness($businessId);
        if (!$business) {
            return null;
        }
        return $business->clients()->with(['bookings', 'conversations'])->find($clientId);
    }

    public function updateClient($businessId, $clientId, array $data)
    {
        $business = $this->findBusiness($businessId);
        if (!$business) {
            return null;
        }
        $client = $business->clients()->find($clientId);
        if (!$client) {
            return null;
        }
        if (isset($data['phone'])) {
            $data['normalized_phone'] = Client::normalizePhone($data['phone']);
        }
        $client->update($data);
        return $client;
    }

    public function deleteClient($businessId, $clientId)
    {
        $business = $this->findBusiness($businessId);
        if (!$business) {
            return null;
        }
        $client = $business->clients()->find($clientId);
        if (!$client) {
            return null;
        }
        if ($client->bookings()->exists()) {
            return false;
        }
        $client->delete();
        return true;
    }
}
