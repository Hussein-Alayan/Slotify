<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('conversation_messages', function (Blueprint $table) {
            // Essential for n8n to know if message came from WhatsApp or going to WhatsApp
            $table->enum('direction', ['inbound', 'outbound'])->default('inbound')->after('sender');
            
            // Track WhatsApp provider message ID for delivery confirmations
            $table->string('external_message_id')->nullable()->after('direction');
            
            // Simple delivery status for n8n workflows
            $table->enum('delivery_status', ['pending', 'sent', 'delivered', 'failed'])->default('pending')->after('external_message_id');
            
            // Phone numbers for n8n to route messages correctly
            $table->string('source_phone')->nullable()->after('delivery_status');
            $table->string('destination_phone')->nullable()->after('source_phone');
            
            // Index for n8n to find messages by phone and business
            $table->index(['business_id', 'source_phone', 'created_at'], 'idx_business_phone_messages');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conversation_messages', function (Blueprint $table) {
            $table->dropIndex('idx_business_phone_messages');
            $table->dropColumn(['direction', 'external_message_id', 'delivery_status', 'source_phone', 'destination_phone']);
        });
    }
};
