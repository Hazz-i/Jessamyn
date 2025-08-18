<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::prefix('dashboard')->group(function () {
        Route::get('products', function () {
            return Inertia::render('Dashboard/Products/Index');
        })->name('dashboard.products.index');

        Route::get('products/create', function () {
            return Inertia::render('Dashboard/Products/Create');
        })->name('dashboard.products.create');

        Route::post('products', [\App\Http\Controllers\ProductController::class, 'store'])
            ->name('dashboard.products.store');
    });
});

Route::fallback(function () {
    return Inertia::render('404');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
