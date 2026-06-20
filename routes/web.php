<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ScheduleController::class, 'welcome'])
    ->name('welcome');

Route::get('/schedule', [ScheduleController::class, 'schedules'])
    ->name('schedule');

Route::get('/route', function () {
    return Inertia::render('OurRoute');
})->name('route');

Route::get('/routefare', function () {
    return Inertia::render('Routefare');
})->name('routefare');

Route::get('/scheduleDetails/{id}', [ScheduleController::class, 'scheduleDetails'])
    ->name('scheduleDetails');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
