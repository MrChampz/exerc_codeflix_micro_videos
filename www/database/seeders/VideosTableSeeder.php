<?php

namespace Database\Seeders;

use App\Models\Video;
use Illuminate\Database\Seeder;

class VideosTableSeeder extends Seeder
{
    public function run()
    {
        Video::factory()->count(100)->create();
    }
}
