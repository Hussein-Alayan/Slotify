<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

use function PHPSTORM_META\map;

class AuthController extends Controller
{
        public function register(RegisterRequest $request){
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password'=> Hash::make($request->password),


            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => new UserResource($user),
                'token' => $token,
            ], 201);
        }

        public function login(LoginRequest $request){
            $user = User::where('email', $request->email)->first();

            if(! $user || !Hash::check($request->password, $user->password)){
                return response()->json(['message'=>'Invalid Credentials '], 422);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user'=> new UserResource($user),
                'token'=> $token,
            ]);

        }

        public function logout(Request $request)
        {
            $request->user()->currentAccessToken()->delete();

            return response()->json(['message' => 'Logged out successfully']);
        }

        public function me(Request $request)
        {
            return new UserResource($request->user());
        }
}
