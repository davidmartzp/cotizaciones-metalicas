<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
  
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ProductController;

   
Route::controller(RegisterController::class)->group(function(){
    Route::post('register', 'register');
    Route::post('login', 'login');
});
         
Route::middleware('auth:sanctum')->group( function () {
    
    Route::get('/getBudgetById/{id}', 'App\Http\Controllers\BudgetController@getBudgetById');
    Route::get('/getBudgets', 'App\Http\Controllers\BudgetController@getBudgets');
    Route::post('/storeBudget', 'App\Http\Controllers\BudgetController@storeBudget');
    Route::put('/updateBudget/{id}', 'App\Http\Controllers\BudgetController@updateBudget');
    
    Route::get('/searchProduct', 'App\Http\Controllers\ProductController@searchProduct');
    Route::get('/getProducts', 'App\Http\Controllers\ProductController@index');
    Route::post('/storeProduct', 'App\Http\Controllers\ProductController@store');
    Route::get('/getProductById/{id}', 'App\Http\Controllers\ProductController@show');
    Route::put('/updateProduct/{id}', 'App\Http\Controllers\ProductController@update');

    //Users 
    Route::get('/getUsers', 'App\Http\Controllers\UserController@getUsers');
    Route::get('/getUserById/{id}', 'App\Http\Controllers\UserController@getUserById');
    Route::put('/updateUser/{id}', 'App\Http\Controllers\UserController@updateUser');

});


//create a route that hash via post a string as a password
Route::post('/hashPassword', 'App\Http\Controllers\HashController@hashPassword');