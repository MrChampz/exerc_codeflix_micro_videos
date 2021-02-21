<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition()
    {
        return [
            'name' => $this->faker->colorName,
            'description' => rand(1, 10) % 2 == 0 ? $this->faker->sentence() : null
        ];
    }
}
