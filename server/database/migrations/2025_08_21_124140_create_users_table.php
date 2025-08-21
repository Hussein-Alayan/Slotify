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
        Schema::create('users', function (Blueprint $table) {
            $table->id();                          // Primary key
            $table->string('name');               
            $table->string('email')->unique();     
            $table->string('password');           
            $table->string('phone')->nullable();   
        $table->boolean('is_active')->default(true); // Active/inactive
        $table->timestampsTz();                // created_at, updated_at with timezone
    });

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
