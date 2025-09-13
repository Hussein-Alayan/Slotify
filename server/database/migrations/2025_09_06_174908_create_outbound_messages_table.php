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
        Schema::create('outbound_messages', function (Blueprint $table) {
            $table->id();
            
            // Essential info for n8n to send WhatsApp messages
            $table->foreignId('business_id')->constrained('businesses')->onDelete('cascade');
            $table->string('recipient_phone'); // who to send to
            $table->text('message_content'); // what to send
            
            // Simple status tracking for n8n
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');
            $table->string('external_message_id')->nullable(); // WhatsApp provider's message ID
            $table->text('error_message')->nullable(); // if sending failed
            
            // Timing
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
            
            // Indexes for n8n to process messages efficiently
            $table->index(['status', 'created_at'], 'idx_status_queue');
            $table->index(['business_id', 'recipient_phone'], 'idx_business_recipient');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outbound_messages');
    }
};
