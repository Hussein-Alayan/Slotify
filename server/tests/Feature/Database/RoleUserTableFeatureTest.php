<?php

namespace Tests\Feature\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Schema;

class RoleUserTableFeatureTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function role_user_table_has_expected_columns()
    {
        $this->assertTrue(
            Schema::hasColumns('role_user', [
                'id', 'user_id', 'role_id', 'created_at', 'updated_at'
            ]),
            'Role_User table does not have expected columns.'
        );
    }
}
