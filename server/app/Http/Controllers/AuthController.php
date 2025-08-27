<?php
namespace App\Http\Controllers;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Services\AuthService;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated());
        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->validated());
        if (! $result) {
            return response()->json(['message' => 'Invalid Credentials'], 422);
        }
        // Log the user in using session/cookie
        Auth::login($result['user']);
        // Redirect to frontend dashboard or return success
        return response()->json([
            'user' => new UserResource($result['user'])
        ]);
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return new UserResource($this->authService->me($request->user()));
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect('http://localhost:3000/auth/signin?error=google_auth_failed');
        }

        if (! $googleUser || ! $googleUser->getEmail()) {
            return redirect('http://localhost:3000/auth/signin?error=google_no_email');
        }

        $result = $this->authService->loginWithGoogle($googleUser);
        // Log the user in using session/cookie
        Auth::login($result['user']);
        // Redirect to frontend dashboard
        return redirect('http://localhost:3000/auth/google/callback');
    }
}
