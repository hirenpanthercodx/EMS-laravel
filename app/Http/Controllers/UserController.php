<?php

namespace App\Http\Controllers;

use Cartalyst\Sentinel\Laravel\Facades\Sentinel;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function authUser() {
        try {  
            $userData = Auth::user(); 
            $sentinel = Sentinel::findRoleById($userData->id);

            $response = [
                'success' => true,
                'data' => $sentinel,
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
