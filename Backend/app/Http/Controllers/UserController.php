<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    //Método web para reestablecer la contraseña de un usuario, debe pedir un token oculto
    public function resetPassword(Request $request)
    {

        //traducir los mensajes de error al español
        $messages = [
            'reset_password_token.required' => 'El token es requerido',
            'reset_password_token.exists' => 'Token inválido',
            'password.required' => 'La contraseña es requerida',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'password.confirmed' => 'Las contraseñas no coinciden',
            'password_confirmation.required' => 'La confirmación de la contraseña es requerida',
            'password_confirmation.min' => 'La confirmación de la contraseña debe tener al menos 8 caracteres'
        ];

        $request->validate([
            'reset_password_token' => 'required|string|exists:users,reset_password_token',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8'
        ], $messages);

        $user = User::where('reset_password_token', $request->input('reset_password_token'))->first();
        if ($user) {
            $user->password = Hash::make($request->input('password'));
            $user->reset_password_token = null;
            $user->save();
            // mensaje de éxito a la misma ruta 
            return redirect()->route('recuperar-password', ['token' => $request->input('reset_password_token')])
                             ->with('status', 'Contraseña reestablecida con éxito');
        } else {
            return redirect()->route('recuperar-password', ['token' => $request->input('reset_password_token')])
                             ->withErrors(['reset_password_token' => 'Token inválido']);
        }
    }

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

    //actualizar el estado de un usuario por id si es 0 pasa a 1 y viceversa
    public function updateUserStatus($id)
    {
        $user = User::find($id);
        if($user->status == 0){
            $user->status = 1;
        }else{
            $user->status = 0;
        }
        $user->save();

        return response()->json($user);
    }

    //crear un usuario y mandar mail de creación de contraseña
    public function storeUser(Request $request)
    {
        $user = new User();
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->phone = $request->input('phone');
        $user->initials = $request->input('initials');
        $user->role = $request->input('role');
        $user->status = $request->input('status');
        
        $user->reset_password_token = md5($request->input('email').time());
        
        //Generar un código ramdom para la contraseña
        $user->password = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 8);
        
        $user->save();

        return response()->json(['id' => $user->id]);

    }

}