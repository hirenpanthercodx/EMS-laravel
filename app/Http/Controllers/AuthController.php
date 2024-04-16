<?php

namespace App\Http\Controllers;

use App\Models\User;
use Cartalyst\Sentinel\Laravel\Facades\Sentinel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login (Request $request) {

        if (Auth::attempt(['email'=>$request->email, 'password'=>$request->password])) {  
            $user = Auth::User(); 
            Session::regenerate();
            Session::put('auth_user', Auth::user());

            $success['token'] = $user->createToken('MyApp')->plainTextToken;
            $success['user'] = $user; 
            $success['role'] = Sentinel::findRoleById($user->id); 
            $response = [
                'success' => true,
                'data' => $success,
                'message' => 'user login successfully'
            ];

            return response()->json($response, 200);

        } else {
            $response = [
                'success' => false,
                'message' => 'something went wrong'
            ];

            return response()->json($response, 500);
        }
    }

    public function logout() {        
        try {
            $user = Auth::User(); 
            $user->tokens()->delete();
            Auth::guard('web')->logout();
            Session::invalidate();

            $response = [
                'success' => true,
                'message' => 'user logout successfully'
            ];

            return response()->json($response, 200);

        } catch ( \Exception $e ) {
            return response()->json(['error'=>$e->getMessage()], 500);
        }
    }
}
