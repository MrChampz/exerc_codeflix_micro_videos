<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Genre;
use Illuminate\Database\Seeder;

class GenresTableSeeder extends Seeder
{
    public function run()
    {
        $categories = Category::all();
        Genre::factory()->count(100)->create()
            ->each(function (Genre $genre) use ($categories) {
                $categoriesId = $categories
                    ->random(5)
                    ->pluck('id')
                    ->toArray();
                $genre->categories()->attach($categoriesId);
            });
    }
}
