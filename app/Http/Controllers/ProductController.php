<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $products = Product::orderBy('created_at', 'desc')->paginate(12);
        $products = Product::with('user', 'productVariants')->orderBy('created_at', 'desc')->paginate(12);

        return Inertia::render('Products/Index', [
            'products' => $products
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    return Inertia::render('Products/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $product_validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'image|mimes:jpg,jpeg,png,webp,avif|max:2048',
            'sub_image' => 'nullable|image|mimes:jpg,jpeg,png,webp,avif|max:2048',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'category' => 'nullable|string|in:Bundle,Single',
        ]);

        $path = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
        }

        $subPath = null;
        if ($request->hasFile('sub_image')) {
            $subPath = $request->file('sub_image')->store('products', 'public');
        }
        try {
            $product = Product::create([
                'name' => $product_validated['name'],
                'image' => $path ? '/storage/' . $path : '',
                'sub_image' => $subPath ? '/storage/' . $subPath : '',
                'description' => $product_validated['description'] ?? null,
                'category' => $product_validated['category'] ?? null,
                'is_active' => false,
                'user_id' => auth()->id(),
            ]);

            return redirect()
                ->route('product.index')
                ->with('success', 'Product created. Please add at least one variant.');
        } catch (\Throwable $e) {
            report($e);
            // In local/dev, surface the exact error to help diagnose
            if (app()->environment('local')) {
                return back()->withErrors(['general' => $e->getMessage()])->withInput();
            }
            return back()->withErrors(['general' => 'Failed to save product'])->withInput();
        }
    }

    public function show(Product $product)
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
                'id' => $product->user->id,
                'name' => $product->user->name,
            ] : null,
            'variants' => $product->relationLoaded('productVariants') ? $product->productVariants->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'variant' => $variant->variant,
                    'price' => $variant->price,
                    'stock_qty' => $variant->stock_qty,
                ];
            }) : [],
        ];

        return Inertia::render('Products/Details', [
            'product' => $payload,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'image' => 'sometimes|image|mimes:jpg,jpeg,png,webp,avif|max:2048',
            'sub_image' => 'sometimes|image|mimes:jpg,jpeg,png,webp,avif|max:2048',
            'description' => 'sometimes|nullable|string',
        ]);

        if ($request->hasFile('image')) {
            // Optionally delete old file if existed and path is within /storage/products
            if ($product->image && str_starts_with($product->image, '/storage/')) {
                $old = str_replace('/storage/', '', $product->image);
                if (Storage::disk('public')->exists($old)) {
                    Storage::disk('public')->delete($old);
                }
            }
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        if ($request->hasFile('sub_image')) {
            if ($product->sub_image && str_starts_with($product->sub_image, '/storage/')) {
                $old = str_replace('/storage/', '', $product->sub_image);
                if (Storage::disk('public')->exists($old)) {
                    Storage::disk('public')->delete($old);
                }
            }
            $subPath = $request->file('sub_image')->store('products', 'public');
            $validated['sub_image'] = '/storage/' . $subPath;
        }

        try {
            $product->update($validated);
        } catch (\Throwable $e) {
            report($e);
            return back()->withErrors(['general' => 'Terjadi kesalahan saat memperbarui produk.'])->withInput();
        }

        return redirect()->route('product.show', $product->id)->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Delete image file if exists
        if ($product->image && str_starts_with($product->image, '/storage/')) {
            $old = str_replace('/storage/', '', $product->image);
            if (Storage::disk('public')->exists($old)) {
                Storage::disk('public')->delete($old);
            }
        }

        if ($product->sub_image && str_starts_with($product->sub_image, '/storage/')) {
            $old = str_replace('/storage/', '', $product->sub_image);
            if (Storage::disk('public')->exists($old)) {
                Storage::disk('public')->delete($old);
            }
        }

        $product->delete();

        return redirect()->route('product.index')->with('success', 'Product deleted successfully.');
    }
}
