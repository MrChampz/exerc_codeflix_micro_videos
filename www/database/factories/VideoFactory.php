<?php

namespace Database\Factories;

use App\Models\Video;
use Illuminate\Database\Eloquent\Factories\Factory;

class VideoFactory extends Factory
{
    protected $model = Video::class;

    public function definition()
    {
        $rating = array_rand(Video::RATING_LIST);
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->sentence(10),
            'year_launched' => rand(1895, 2022),
            'opened' => rand(0, 1),
            'rating' => Video::RATING_LIST[$rating],
            'duration' => rand(1, 30)
        ];
    }
}
