<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Admin', 'slug' => 'admin', 'permissions' => '[{"view_user": true}, {"create_user": true}, {"update_user": true}, {"delete_user" : true}, {"view_calendar": true}, {"create_calendar": true}, {"update_calendar": true}, {"delete_calendar": true}]'],
            ['name' => 'Hr', 'slug' => 'hr', 'permissions' => '[{"view_user": true}, {"create_user": true}, {"update_user": true}, {"delete_user": true}]'],
            ['name' => 'Staff', 'slug' => 'staff', 'permissions' => '[]']
        ];

        foreach($roles as $role) {
            Role::create($role);
        }

    }
}
