<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call(CategoriesTableSeeder::class);
        $this->call(GenresTableSeeder::class);
        $this->call(CastMembersTableSeeder::class);
        $this->call(VideosTableSeeder::class);
    }
}
