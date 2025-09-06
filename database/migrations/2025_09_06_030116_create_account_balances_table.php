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
        Schema::create('account_balances', function (Blueprint $table) {
            $table->id();
            $table->string('period_month', 7)->unique();   // YYYY-MM
            $table->decimal('opening_equity', 14, 2)->default(0);
            $table->decimal('owner_contribution', 14, 2)->default(0);
            $table->decimal('owner_draw', 14, 2)->default(0);
            $table->decimal('net_income', 14, 2)->default(0);
            $table->decimal('closing_equity', 14, 2)->default(0);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_balances');
    }
};
