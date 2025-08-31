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

    public function showProduct(Product $product)
    {
        $product->load([
            'user:id,name', // tetap load user tapi hanya ambil name
            'productVariants' => function ($q) {
                $q->select('id', 'product_id', 'variant', 'price', 'stock_qty')
                    ->orderBy('price');
            },
        ]);

        $payload = [
            'id' => $product->id,
            'name' => $product->name,
            'image' => $product->image,
            'sub_image' => $product->sub_image,
            'description' => $product->description,
            'category' => $product->category,
            'user' => $product->relationLoaded('user') && $product->user ? [
                'name' => $product->user->name,
            ] : null,
            'variants' => $product->relationLoaded('productVariants')
                ? $product->productVariants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'variant' => $variant->variant,
                        'price' => $variant->price,
                        'stock_qty' => $variant->stock_qty,
                    ];
                })
                : [],
        ];

        return Inertia::render('Home/ProductDetail', [
            'product' => $payload,
        ]);
    }

}
