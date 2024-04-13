<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['email' => 'hiren.panthercodx@gmail.com', 'password' => Hash::make('1234')],
            ['email' => 'sanjay.panthercodx@gmail.com', 'password' => Hash::make('1234')],
            ['email' => 'rahul.panthercodx@gmail.com', 'password' => Hash::make('1234')],
            ['email' => 'vishal.panthercodx@gmail.com', 'password' => Hash::make('1234')]
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
