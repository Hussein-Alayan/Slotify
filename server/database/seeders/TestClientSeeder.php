<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TestClientSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('clients')->insert([
            'business_id' => 1, // assumes TestBusinessSeeder runs first
            'name' => 'Test Client',
            'phone' => '1234567890',
            'email' => 'testclient@example.com',
            'no_show_count' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
