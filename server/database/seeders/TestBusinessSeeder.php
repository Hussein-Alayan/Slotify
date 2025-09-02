<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestBusinessSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('businesses')->insert([
            'name' => 'Test Business',
            'industry' => 'Testing',
            'contact_email' => 'testbusiness@example.com',
            'contact_phone' => '555-1234',
            'address' => '123 Test St',
            'brand_voice' => 'formal',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
