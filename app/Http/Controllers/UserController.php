<?php

namespace App\Http\Controllers;

use App\Models\User;
use Cartalyst\Sentinel\Laravel\Facades\Sentinel;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function authUser() {
        try {  
            $userData = Auth::user(); 
            $user = User::find($userData->id);
            $data = ($user->roles()->get())[0]->id;

            $rolesByUser['user'] = $user;
            $rolesByUser['role'] = Sentinel::findRoleById($data);

            $response = [
                'success' => true,
                'data' => $rolesByUser,
                'message' => 'data retrieved successfully'
            ];
            return response()->json($response, 200);
        } catch ( \Exception $e ) {
            $response = [
                'success' => false,
                'message' => 'something went wrong'
            ];

            return response()->json($response, 500);
        }
    }
    
}
