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
        Schema::table('bookings', function (Blueprint $table) {
            // Track how booking was created (essential for n8n analytics)
            $table->string('source')->default('web')->after('status'); // web, whatsapp, api
            
            // Simple cancellation tracking for n8n workflows
            $table->string('cancellation_reason')->nullable()->after('source');
            $table->timestamp('cancelled_at')->nullable()->after('cancellation_reason');
            
            // Index for n8n to find bookings by source and business
            $table->index(['business_id', 'source', 'start_time'], 'idx_business_source_bookings');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex('idx_business_source_bookings');
            $table->dropColumn(['source', 'cancellation_reason', 'cancelled_at']);
        });
    }
};
