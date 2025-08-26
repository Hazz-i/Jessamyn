<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AccountController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('accounts', AccountController::class);

    // Route::prefix('dashboard')->group(function () {
    //     Route::get('products', function () {
    //         return Inertia::render('Dashboard/Products/Index');
    //     })->name('dashboard.products.index');

    //     Route::get('products/create', function () {
    //         return Inertia::render('Dashboard/Products/Create');
    //     })->name('dashboard.products.create');

    //     Route::post('products', [\App\Http\Controllers\ProductController::class, 'store'])
    //         ->name('dashboard.products.store');
    // });

    // Dashboard - Route
    Route::get('product', function () {
        return Inertia::render('Products/Index');
    })->name('products.index');
    Route::get('accounts', function () {
        return Inertia::render('Accounts/Index');
    })->name('accounts.index');
    Route::get('transactions', function () {
        return Inertia::render('Transactions/Index');
    })->name('transactions.index');

    // Activity - Accounting Route
    Route::get('jurnal-umum', function () {
        return Inertia::render('JurnalUmum/Index');
    })->name('jurnalUmum.index');
    Route::get('buku-besar', function () {
        return Inertia::render('BukuBesar/Index');
    })->name('bukuBesar.index');
});

Route::fallback(function () {
    return Inertia::render('404');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
