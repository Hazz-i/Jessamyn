<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;


class HomeController extends Controller
{
    public function index()
    {
        $products = Product::limit(4)->get();
        return Inertia::render('Home/Index', [
            'products' => $products
        ]);
    }

    public function products()
    {
        $products = Product::orderBy('created_at', 'desc')->paginate(12);
        return Inertia::render('Home/Product', [
            'products' => $products
        ]);
    }
}
