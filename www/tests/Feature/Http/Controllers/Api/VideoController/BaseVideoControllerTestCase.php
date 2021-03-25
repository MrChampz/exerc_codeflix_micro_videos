<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

abstract class BaseVideoControllerTestCase extends TestCase
{
    use DatabaseMigrations;

    protected $video;
    protected $sendData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->video = Video::factory()->create([
            'opened' => false
        ]);
        $category = Category::factory()->create();
        $genre = Genre::factory()->create();
        $genre->categories()->sync($category->id);
        $this->sendData = [
            'title' => 'title',
            'description' => 'description',
            'year_launched' => 2010,
            'rating' => Video::RATING_LIST[0],
            'duration' => 90,
            'categories' => [$category->id],
            'genres' => [$genre->id]
        ];
    }
}
