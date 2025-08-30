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
        Schema::create('product', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->string('image');
            $table->string('sub_image');
            $table->enum('category', ['Bundle', 'Single'])->nullable();
            $table->string('description')->nullable();
            $table->decimal('price', 10, 2)->default(50000);
            $table->integer('stock')->default(0);

            $table->foreignId('user_id')->constrained()->onDelete('cascade');   
        });
    } 

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};
