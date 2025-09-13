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
            // Essential webhook support for n8n
            $table->string('webhook_url')->nullable()->after('email');
            $table->string('provider')->nullable()->after('webhook_url'); // twilio, facebook, etc.
            $table->string('business_number')->nullable()->after('provider'); // normalized format for matching
            
            // Simple status tracking
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending')->after('business_number');
            
            // Essential indexes for fast business lookup by phone
            $table->index(['phone_number', 'channel_type'], 'idx_phone_channel');
            $table->index(['business_number', 'channel_type'], 'idx_business_number_channel');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('communication_channels', function (Blueprint $table) {
            $table->dropIndex('idx_phone_channel');
            $table->dropIndex('idx_business_number_channel');
            
            $table->dropColumn([
                'webhook_url',
                'provider',
                'business_number',
                'status'
            ]);
        });
    }
};
