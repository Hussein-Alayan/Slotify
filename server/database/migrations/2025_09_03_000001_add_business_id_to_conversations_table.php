<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, add the column as nullable
        Schema::table('conversations', function (Blueprint $table) {
            $table->unsignedBigInteger('business_id')->nullable()->after('client_id');
        });

        // Update existing conversations to get business_id from their client
        DB::statement('
            UPDATE conversations 
            SET business_id = (
                SELECT business_id 
                FROM clients 
                WHERE clients.id = conversations.client_id
            )
        ');

        // Now add the foreign key constraint and make it NOT NULL
        Schema::table('conversations', function (Blueprint $table) {
            $table->unsignedBigInteger('business_id')->nullable(false)->change();
            $table->foreign('business_id')->references('id')->on('businesses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropForeign(['business_id']);
            $table->dropColumn('business_id');
        });
    }
};
