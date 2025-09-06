<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\CommunicationChannel;
use App\Models\Service;
use App\Models\Resource;
use App\Services\BusinessService;
use Illuminate\Database\Seeder;

class WhatsAppTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 Creating WhatsApp test data...');

        // Create test business with factory
        $business = Business::factory()
            ->forWhatsAppTesting()
            ->create();

        $this->command->info("✅ Business created: {$business->name} (ID: {$business->id})");

        // Create WhatsApp communication channel
        $channel = CommunicationChannel::factory()
            ->whatsapp()
            ->create([
                'business_id' => $business->id,
            ]);

        $this->command->info("✅ WhatsApp channel created: {$channel->business_number}");

        // Create some services for the business
        $services = [
            ['name' => 'Haircut', 'duration_minutes' => 30, 'price' => 50.00, 'description' => 'Professional haircut'],
            ['name' => 'Hair Color', 'duration_minutes' => 90, 'price' => 120.00, 'description' => 'Full hair coloring service'],
            ['name' => 'Blowout', 'duration_minutes' => 45, 'price' => 40.00, 'description' => 'Professional styling'],
        ];

        foreach ($services as $serviceData) {
            Service::create([
                'business_id' => $business->id,
                ...$serviceData
            ]);
        }

        $this->command->info("✅ Created " . count($services) . " services");

        // Create resources (staff/equipment)
        $resources = [
            ['name' => 'Sarah (Stylist)', 'type' => 'staff'],
            ['name' => 'Mike (Barber)', 'type' => 'staff'],
            ['name' => 'Styling Chair 1', 'type' => 'equipment'],
            ['name' => 'Styling Chair 2', 'type' => 'equipment'],
        ];

        foreach ($resources as $resourceData) {
            Resource::create([
                'business_id' => $business->id,
                ...$resourceData
            ]);
        }

        $this->command->info("✅ Created " . count($resources) . " resources");

        // Create booking rule for the business
        \App\Models\BookingRule::create([
            'business_id' => $business->id,
            'hours_of_operation' => [
                'monday' => ['open' => '09:00', 'close' => '18:00'],
                'tuesday' => ['open' => '09:00', 'close' => '18:00'],
                'wednesday' => ['open' => '09:00', 'close' => '18:00'],
                'thursday' => ['open' => '09:00', 'close' => '18:00'],
                'friday' => ['open' => '09:00', 'close' => '18:00'],
                'saturday' => ['open' => '10:00', 'close' => '16:00'],
                'sunday' => ['closed' => true]
            ],
            'buffer_time_minutes' => 15,
            'cancellation_policy' => 'Cancellations must be made at least 24 hours in advance.'
        ]);

        $this->command->info("✅ Created booking rule");

        // Generate the workflow JSON using BusinessService
        $businessService = new BusinessService();
        $workflowData = [
            'business' => $business->fresh()->toArray(),
            'services' => $business->services()->get()->toArray(),
            'resources' => $business->resources()->get()->toArray(),
            'communication_channels' => $business->communicationChannels()->get()->toArray(),
        ];
        
        $business->update([
            'workflow' => json_encode($workflowData)
        ]);

        $this->command->info("✅ Generated workflow JSON");

        $this->command->warn('🎯 Test Data Summary:');
        $this->command->line("Business Phone: {$business->contact_phone}");
        $this->command->line("WhatsApp Number: {$channel->business_number}");
        $this->command->line("Use this in your webhook test: to_phone = '{$channel->business_number}'");
        
        $this->command->info('🚀 Ready for webhook testing!');
    }
}
