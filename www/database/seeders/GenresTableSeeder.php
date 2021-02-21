<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;

class GenresTableSeeder extends Seeder
{
    public function run()
    {
        Genre::factory()->count(100)->create();
    }
}
