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
        Schema::table('communication_channels', function (Blueprint $table) {
            // Essential for n8n webhook integration
            $table->string('webhook_url')->nullable()->after('email');
            $table->string('provider')->nullable()->after('webhook_url'); // twilio, facebook, etc.
            $table->string('business_number')->nullable()->after('provider'); // normalized for n8n lookup
            
            // Simple status for n8n to know if channel is ready
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending')->after('business_number');
            
            // Fast lookup index for n8n to find business by incoming phone
            $table->index(['business_number', 'channel_type'], 'idx_business_lookup');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('communication_channels', function (Blueprint $table) {
            $table->dropIndex('idx_business_lookup');
            $table->dropColumn(['webhook_url', 'provider', 'business_number', 'status']);
        });
    }
};
