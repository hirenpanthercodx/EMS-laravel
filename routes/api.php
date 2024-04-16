<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TrackerController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/userInfo', [UserController::class, 'authUser']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::post('/employee/store', [EmployeeController::class, 'store']);
    Route::post('/employee/{id}/update', [EmployeeController::class, 'update']);
    Route::get('/employee/show', [EmployeeController::class, 'employeeData']);
    Route::get('/employee/edit/{id}', [EmployeeController::class, 'editEmployee']);
    Route::delete('/employee/{id}/delete', [EmployeeController::class, 'delete']);

    Route::post('/calendar/create', [CalendarController::class, 'create']);
    Route::post('/calendar/{event_id}/update', [CalendarController::class, 'update']);
    Route::get('/calendar/{event_id}/edit', [CalendarController::class, 'edit']);
    Route::delete('/calendar/{event_id}/delete', [CalendarController::class, 'delete']);
    Route::post('/calendar/all', [CalendarController::class, 'getCalendarData']);

    Route::post('/tracker/add', [TrackerController::class, 'add']);
    Route::get('/tracker/getTracker', [TrackerController::class, 'getTrackerData']);

});

