<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'name' => $this->faker->word(),
            // 'price' => $this->faker->randomFloat(2, 1, 100),
            // // Use picsum.photos for guaranteed loading images
            // 'image' => 'https://picsum.photos/seed/' . $this->faker->unique()->word() . '/400/300',
            // 'category' => $this->faker->randomElement(['bundle', 'single']),
            // 'variant' => $this->faker->randomElement(['60ml', '120ml']),
            // 'description' => $this->faker->sentence(),
            // 'stock' => $this->faker->numberBetween(0, 100),
            // 'status' => $this->faker->boolean(),

            // 'user_id' => 1,
        ];
    }
}
