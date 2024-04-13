<?php

namespace Database\Seeders;

use App\Models\RoleUser;
use Illuminate\Database\Seeder;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role_user = [
            ['user_id' => 1, 'role_id' => 1],
            ['user_id' => 2, 'role_id' => 3],
            ['user_id' => 3, 'role_id' => 2],
            ['user_id' => 4, 'role_id' => 1]
        ];

        foreach($role_user as $role) {
            RoleUser::create($role);
        }
    }
}
