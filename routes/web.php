<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AccountController;

use App\Models\Product;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\JurnalUmumController;
use App\Http\Controllers\AccountingController;
use App\Http\Controllers\ShopeeImportController;
use App\Http\Controllers\AccountBalanceController;

// Company Profile
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/all-products', [HomeController::class, 'products'])->name('products');
Route::get('/productShow/{product}', [HomeController::class, 'showProduct'])->name('products.show');


// Dashboard Routes
Route::middleware(['auth', 'verified'])->group(function () {

    Route::resource('dashboard', DashboardController::class);
    Route::resource('product', ProductController::class);
    // Nested resource for product variants
    Route::resource('product.variants', ProductVariantController::class)->only(['store', 'update', 'destroy']);
    
    Route::resource('accounts', AccountController::class);
    Route::resource('jurnal-umum', JurnalUmumController::class)
        ->parameters(['jurnal-umum' => 'accounting']);
    // Specific reporting pages first to avoid conflict with resource wildcard
    Route::get('/reporting/all-report', [AccountBalanceController::class, 'show'])->name('reporting.all');
    Route::get('reporting/export/worksheet', [AccountingController::class, 'exportWorksheet'])->name('reporting.export.worksheet');
    Route::resource('reporting', AccountingController::class);

    Route::post('shopee/preview', [ShopeeImportController::class, 'preview'])->name('shopee.preview');
    Route::post('shopee/commit',  [ShopeeImportController::class, 'commit'])->name('shopee.commit');

    Route::get('transactions', function () {
        return Inertia::render('Transactions/Index');
    })->name('transactions.index');

    Route::post('/equity-report', [AccountBalanceController::class, 'generate'])
    ->name('equity.generate');

    
});


// Handling 404 - Page Not Found
Route::fallback(function () {
    return Inertia::render('404');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
