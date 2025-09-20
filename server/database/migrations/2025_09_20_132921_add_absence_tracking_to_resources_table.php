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
        Schema::table('resources', function (Blueprint $table) {
            $table->boolean('is_absent')->default(false)->after('availability');
            $table->text('absence_reason')->nullable()->after('is_absent');
            $table->timestamp('absence_start')->nullable()->after('absence_reason');
            $table->timestamp('absence_end')->nullable()->after('absence_start');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resources', function (Blueprint $table) {
            $table->dropColumn(['is_absent', 'absence_reason', 'absence_start', 'absence_end']);
        });
    }
};
