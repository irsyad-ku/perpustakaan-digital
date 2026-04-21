<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = Auth::login($user);

        return response()->json([
            'status'  => 'success',
            'message' => 'Registrasi berhasil',
            'user'    => $user,
            'token'   => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = Auth::attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau password salah'
            ], 401);
        }

        return response()->json([
            'status'       => 'success',
            'token'        => $token,
            'token_type'   => 'bearer',
            'expires_in'   => Auth::factory()->getTTL() * 60,
            'user'         => Auth::user(),
        ]);
    }

    public function refresh()
    {
        $token = Auth::refresh();
        return response()->json([
            'status'     => 'success',
            'token'      => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json(['status' => 'success', 'message' => 'Logout berhasil']);
    }

    public function me()
    {
        return response()->json([
            'status' => 'success',
            'user'   => Auth::user(),
        ]);
    }
}
