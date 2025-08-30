<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_variant', function (Blueprint $table) {
            $table->id();
            $table->enum('variant', ['25ml' ,'60ml', '100ml', '120ml', '250ml', '60ml-25ml-100ml']);
            $table->decimal('price', 10, 2); 
            $table->integer('stock_qty')->default(0);
            $table->timestamps();

            $table->foreignId('product_id')->constrained('product')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variant');
    }
};
