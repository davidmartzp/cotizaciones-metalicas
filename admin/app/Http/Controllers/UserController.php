<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    //Rutas api para manejo de usuarios, retorna json
    public function getUsers()
    {
        $users = User::all();
        return response()->json($users);
    } 

    //Obtener un usurio por id 
    public function getUserById($id)
    {
        $user = User::find($id);
        return response()->json($user);
    }

    //Actualizar un usuario por id
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->phone = $request->input('phone');
        $user->initials = $request->input('initials');
        $user->role = $request->input('role');
        $user->status = $request->input('status');
        $user->save();

        return response()->json($user);
    }

}