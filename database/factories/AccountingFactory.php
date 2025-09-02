<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Accounting>
 */
class AccountingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // default dummy; nilai akan dioverride di seeder
        return [
            'description' => $this->faker->sentence(4),
            'credit'      => 0,
            'debit'       => 0,
            'image'       => null,
            'note'        => 'JV-DUMMY',
            'account_id'  => 1,
            'user_id'     => 1,
            'created_at'  => Carbon::now(),
            'updated_at'  => Carbon::now(),
        ];
    }
}
