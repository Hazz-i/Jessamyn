<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('accounting', function (Blueprint $table) {
            $table->id();
            $table->string('description');
            $table->decimal('credit', 10, 2);
            $table->decimal('debit', 10, 2);
            $table->string('image')->nullable();
            $table->string('note')->nullable();
            $table->date('date')->default(Carbon::now());

            $table->foreignId('account_id')->constrained('account')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounting');
    }
};
    