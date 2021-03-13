<?php

namespace Database\Seeders;

use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\Seeder;

class VideosTableSeeder extends Seeder
{
    public function run()
    {
        $genres = Genre::all();
        Video::factory()->count(100)->create()
            ->each(function (Video $video) use ($genres) {
                $subGenres = $genres->random(5)->load('categories');
                $genresId = $subGenres->pluck('id')->toArray();
                $categoriesId = [];
                foreach ($subGenres as $genre) {
                    array_push(
                        $categoriesId,
                        ...$genre->categories()->pluck('id')->toArray()
                    );
                }
                $categoriesId = array_unique($categoriesId);
                $video->categories()->attach($categoriesId);
                $video->genres()->attach($genresId);
            });
    }
}
