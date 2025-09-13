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
        Schema::table('conversations', function (Blueprint $table) {
            $table->index(['business_id', 'client_id']);
            $table->index('created_at');
        });

        Schema::table('conversation_messages', function (Blueprint $table) {
            $table->index(['conversation_id', 'created_at']);
            $table->index(['business_id', 'client_id']);
            $table->index('sender');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropIndex(['business_id', 'client_id']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('conversation_messages', function (Blueprint $table) {
            $table->dropIndex(['conversation_id', 'created_at']);
            $table->dropIndex(['business_id', 'client_id']);
            $table->dropIndex(['sender']);
        });
    }
};
