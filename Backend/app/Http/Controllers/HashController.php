<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class HashController extends Controller
{
    //HASH A STRING WITH LARAVEL HASH
    public function hashPassword(Request $request)
    {
        $passwords = $request->input('passwords');
        $hashedPasswords = [];

        foreach ($passwords as $password) {
            $hashedPassword = Hash::make($password);
            $hashedPasswords[] = $hashedPassword;
        }

        return response()->json(['hashedPasswords' => $hashedPasswords], 200);
    }
}
