<?php

namespace Tests\Feature\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Schema;

class UsersTableFeatureTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function users_table_has_expected_columns()
    {
        $this->assertTrue(
            Schema::hasColumns('users', [
                'id', 'name', 'email', 'password', 'phone', 'is_active', 'created_at', 'updated_at'
            ]),
            'Users table does not have expected columns.'
        );
    }
}
