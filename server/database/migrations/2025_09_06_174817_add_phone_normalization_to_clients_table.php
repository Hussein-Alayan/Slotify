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
        Schema::table('clients', function (Blueprint $table) {
            // Essential for n8n to match WhatsApp numbers to clients reliably
            $table->string('normalized_phone')->nullable()->after('phone');
            
            // WhatsApp consent tracking for n8n compliance
            $table->boolean('whatsapp_opted_in')->default(true)->after('normalized_phone');
            $table->timestamp('last_whatsapp_activity')->nullable()->after('whatsapp_opted_in');
            
            // Fast lookup for n8n to find client by phone number
            $table->index(['business_id', 'normalized_phone'], 'idx_business_phone_lookup');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropIndex('idx_business_phone_lookup');
            $table->dropColumn(['normalized_phone', 'whatsapp_opted_in', 'last_whatsapp_activity']);
        });
    }
};
