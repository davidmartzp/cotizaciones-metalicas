<?php

namespace App\Http\Controllers\Mails;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Mail\setUserPassword;

class sendSetUserPassword extends Controller
{
    public function sendEmail(Request $request)
    {
        $data = [
            'name' => $request->input('name'),
            'link' => env ('APP_URL').'/recuperar-password/'.$this->createCode($request)
        ];

        Mail::to('destinatario@dominio.com')->send(new setUserPassword($data));

        return response()->json(['message' => 'Correo enviado con éxito']);
    }

    //create a code to validate in the frontend
    public function createCode(Request $request)
    {
        //can have the date of creation
        $date = date('Y-m-d H:i:s');
        //can have the user id
        $userId = $request->input('userId');
        
        //create a code
        $code = md5($date.$userId);

        return $code;
    }


    
}
