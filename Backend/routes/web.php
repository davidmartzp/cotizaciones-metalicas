<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/generate-pdf/{id}', [PDFController::class, 'generatePDF']);
Route::get('/generate-pdf/{id}', 'App\Http\Controllers\PDFController@generatePDF');
Route::get('/report/{start_date}/{end_date}/{user_id}/{status}', 'App\Http\Controllers\PDFController@generateReportByStatus')
    ->name('report.byStatus');

Route::get('/linkstorage', function () {
    Artisan::call('storage:link');
    return 'Storage link created successfully!';
});

//route to recover password 
Route::get('recuperar-password/{token}', 'App\Http\Controllers\Auth\ForgotPasswordController@Index')->name("recuperar-password");

//Método para reestablecer la contraseña de un usuario, debe pedir un token oculto
Route::post('resetPassword', 'App\Http\Controllers\UserController@resetPassword')->name('resetPassword');
