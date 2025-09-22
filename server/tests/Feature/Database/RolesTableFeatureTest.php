<?php

namespace Tests\Feature\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Schema;

class RolesTableFeatureTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function roles_table_has_expected_columns()
    {
        $this->assertTrue(
            Schema::hasColumns('roles', [
                'id', 'name', 'created_at', 'updated_at'
            ]),
            'Roles table does not have expected columns.'
        );
    }
}
