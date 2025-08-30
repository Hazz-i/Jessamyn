<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductVariantController extends Controller
{

    /**
     * Store a newly created variant in storage.
     */
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'variant' => 'required|string|in:25ml,60ml,100ml,120ml,250ml,60ml-25ml-100ml',
            'category' => 'in:Bundle,Single',
            'price' => 'required|numeric|min:0',
            'stock_qty' => 'required|integer|min:0',
        ]);

        $variant = new ProductVariant([
            'variant' => $validated['variant'],
            'price' => $validated['price'],
            'stock_qty' => $validated['stock_qty'],
        ]);

        // Mark this product as active once it has at least one variant
        $product->update([
            'is_active' => true,
            'category' => $validated['category'],
        ]);

        $variant->product()->associate($product);
        $variant->user_id = auth()->id();
        $variant->save();

        return redirect()->route('product.show', $product->id)->with('success', 'Variant created successfully.');
    }

    /**
     * Update the specified variant in storage.
     */
    public function update(Request $request, Product $product, ProductVariant $variant)
    {
        if ($variant->product_id !== $product->id) {
            abort(404);
        }

        $validated = $request->validate([
            'variant' => 'required|string|in:25ml,60ml,100ml,120ml,250ml,60ml-25ml-100ml',
            'price' => 'required|numeric|min:0',
            'stock_qty' => 'required|integer|min:0',
        ]);

        $variant->update([
            'variant' => $validated['variant'],
            'price' => $validated['price'],
            'stock_qty' => $validated['stock_qty'],
        ]);

        return redirect()->route('product.show', $product->id)->with('success', 'Variant updated successfully.');
    }

    /**
     * Remove the specified variant from storage.
     */
    public function destroy(Product $product, ProductVariant $variant)
    {
        if ($variant->product_id !== $product->id) {
            abort(404);
        }

        $variant->delete();

        return redirect()->route('product.show', $product->id)->with('success', 'Variant deleted successfully.');
    }
}
