<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AccountController;

use App\Models\Product;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductVariantController;


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/all-products', [HomeController::class, 'products'])->name('products');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::resource('product', ProductController::class);
    // Nested resource for product variants
    Route::resource('product.variants', ProductVariantController::class)->only(['store', 'update', 'destroy']);
    
    Route::resource('accounts', AccountController::class);

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
