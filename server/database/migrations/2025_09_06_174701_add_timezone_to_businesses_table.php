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
        Schema::table('businesses', function (Blueprint $table) {
            // Essential for n8n to calculate booking times correctly
            $table->string('timezone')->default('UTC')->after('address');
            
            // Simple business hours for availability checks (JSON: {"mon": {"start": "09:00", "end": "17:00"}, ...})
            $table->json('business_hours')->nullable()->after('timezone');
            
            // Status for n8n to know if business is ready to take bookings
            $table->enum('status', ['active', 'inactive', 'setup_pending'])->default('setup_pending')->after('business_hours');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn(['timezone', 'business_hours', 'status']);
        });
    }
};
