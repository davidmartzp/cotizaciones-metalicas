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
    //Budgets
    Route::get('/getBudgetById/{id}', 'App\Http\Controllers\BudgetController@getBudgetById');
    Route::get('/getBudgets', 'App\Http\Controllers\BudgetController@getBudgets');
    Route::post('/storeBudget', 'App\Http\Controllers\BudgetController@storeBudget');
    Route::put('/updateBudget/{id}', 'App\Http\Controllers\BudgetController@updateBudget');
    Route::put('/updateBudgetStatus/{id}', 'App\Http\Controllers\BudgetController@updateBudgetStatus');
    Route::delete('/deleteBudget/{id}', 'App\Http\Controllers\BudgetController@deleteBudget');
    Route::post('/cloneBudget/{id}', 'App\Http\Controllers\BudgetController@cloneBudget');
    //Products
    Route::get('/searchProduct', 'App\Http\Controllers\ProductController@searchProduct');
    Route::get('/getProducts', 'App\Http\Controllers\ProductController@index');
    Route::post('/storeProduct', 'App\Http\Controllers\ProductController@store');
    Route::get('/getProductById/{id}', 'App\Http\Controllers\ProductController@show');
    Route::put('/updateProduct/{id}', 'App\Http\Controllers\ProductController@update');
    Route::post('products/import', 'App\Http\Controllers\ProductController@importExcel');

    //Users 
    Route::get('/getUsers', 'App\Http\Controllers\UserController@getUsers');
    Route::get('/getUserById/{id}', 'App\Http\Controllers\UserController@getUserById');
    Route::post('/storeUser', 'App\Http\Controllers\UserController@storeUser');
    Route::put('/updateUser/{id}', 'App\Http\Controllers\UserController@updateUser');
    Route::put('/updateUserStatus/{id}', 'App\Http\Controllers\UserController@updateUserStatus');

    //Observations
    Route::get('/getObservations', 'App\Http\Controllers\ObservationController@getObservations');
});


//create a route that hash via post a string as a password
Route::post('/hashPassword', 'App\Http\Controllers\HashController@hashPassword');

//send email to reset password
Route::post('/sendSetUserPassword', 'App\Http\Controllers\Mails\sendSetUserPassword@sendEmail');