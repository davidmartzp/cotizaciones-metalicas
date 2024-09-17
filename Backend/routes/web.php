<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;


Route::get('/', function () {
    return view('welcome');
});

Route::get('/generate-pdf/{id}', [PDFController::class, 'generatePDF']);
Route::get('/generate-pdf/{id}', 'App\Http\Controllers\PDFController@generatePDF');

Route::get('/linkstorage', function () {
    Artisan::call('storage:link');
    return 'Storage link created successfully!';
});


//route tu recover password 
Route::get('recuperar-password/{id}', 'App\Http\Controllers\Auth\ForgotPasswordController@Index');