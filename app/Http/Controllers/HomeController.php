<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $products = Product::with([
            'user:id,name',
            'productVariants' => function ($q) {
                $q->select('id', 'product_id', 'variant', 'price', 'stock_qty')
                    ->orderBy('price');
            },
        ])->orderBy('created_at', 'desc')->limit(8)->get();

        return Inertia::render('Home/Index', [
            'products' => $products
        ]);
    }

    public function products()
    {
        $products = Product::with([
            'user:id,name',
            'productVariants' => function ($q) {
                $q->select('id', 'product_id', 'variant', 'price', 'stock_qty')
                    ->orderBy('price');
            },
        ])->orderBy('created_at', 'desc')->paginate(12);

        return Inertia::render('Home/Product', [
            'products' => $products
        ]);
    }

    public function showProduct(Product $product)
    {
        $product->load([
            'user:id,name', 
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

        return Inertia::render('Home/DetailsHome', [
            'product' => $payload,
            'auth' => auth()->user(),
        ]);
    }

    public function orderProduct(Product $product, Request $request)
    {
        $name = $request->get('name');
        $price = $request->get('price');
        $variant = $request->get('variant');
        $qty = $request->get('qty');
        $total = $request->get('total');
        
        return Inertia::render('Home/ProductOrder', [
            'product' => $product,
            'order' => compact('name', 'price', 'variant', 'qty', 'total'),
        ]);
    }
}
