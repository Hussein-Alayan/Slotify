<?php 

namespace App\Services; 

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthService {
	public function register(array $data)
	{
		$user = User::create([
			'name' => $data['name'],
			'email' => $data['email'],
			'password' => Hash::make($data['password']),
		]);
		$token = $user->createToken('auth_token')->plainTextToken;
		return compact('user', 'token');
	}

	public function login(array $data)
	{
		$user = User::where('email', $data['email'])->first();
		if (! $user || ! Hash::check($data['password'], $user->password)) {
			return null;
		}
		$token = $user->createToken('auth_token')->plainTextToken;
		return compact('user', 'token');
	}

	public function me($user)
	{
		return $user;
	}
}