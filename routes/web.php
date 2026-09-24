<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ScheduleRefreshController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// The worker is built into public/build/ but must be served from the site root,
// otherwise its scope is limited to /build and it cannot control any page.
Route::get('/sw.js', function () {
    $path = public_path('build/sw.js');

    abort_unless(file_exists($path), 404);

    return response()->file($path, [
        'Content-Type' => 'text/javascript',
        'Service-Worker-Allowed' => '/',
        'Cache-Control' => 'no-cache',
    ]);
})->name('serviceworker');

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

Route::get('/install', function () {
    return Inertia::render('Install');
})->name('install');

Route::get('/book', function () {
    return Inertia::render('BookTrip');
})->name('book');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Refresh trigger for an external cron service (cron-job.org and friends).
// Token-authenticated, so it is excluded from CSRF in bootstrap/app.php.
Route::match(['get', 'post'], '/api/schedules/refresh', ScheduleRefreshController::class)
    ->middleware('throttle:6,1')
    // A token-authenticated machine call: it has no session, needs none, and
    // should not leave one behind. Without this the cron wrote a row to the
    // sessions table on every run, which simply accumulates.
    ->withoutMiddleware([
        \Illuminate\Session\Middleware\StartSession::class,
        // CSRF too: it reads the session, which is no longer there. Note the
        // class is PreventRequestForgery in Laravel 13 — ValidateCsrfToken and
        // VerifyCsrfToken are aliases and excluding those matches nothing.
        \Illuminate\Foundation\Http\Middleware\PreventRequestForgery::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \App\Http\Middleware\HandleInertiaRequests::class,
    ])
    ->name('schedules.refresh');
