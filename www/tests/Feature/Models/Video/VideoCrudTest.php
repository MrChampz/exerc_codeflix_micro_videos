<?php

namespace Tests\Feature\Models\Video;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\QueryException;

class VideoCrudTest extends BaseVideoTestCase
{
    private $fileFields = [];

    protected function setUp(): void
    {
        parent::setUp();
        foreach (Video::$fileFields as $field) {
            $this->fileFields[$field] = "$field.test";
        }
    }

    public function testList()
    {
        $videos = Video::all();
        $videoKeys = array_keys($videos->first()->getAttributes());

        $this->assertCount(1, $videos);
        $this->assertEqualsCanonicalizing(
            [
                'id',
                'title',
                'description',
                'year_launched',
                'opened',
                'rating',
                'duration',
                'video_file',
                'trailer_file',
                'thumb_file',
                'banner_file',
                'created_at',
                'updated_at',
                'deleted_at'
            ],
            $videoKeys
        );
    }

    public function testCreateWithBasicFields()
    {
        $video = Video::create($this->data + $this->fileFields);
        $video->refresh();

        $this->assertTrue($this->uuidValidator->validate($video->id));
        $this->assertEquals('title', $video->title);
        $this->assertEquals('description', $video->description);
        $this->assertEquals(2010, $video->year_launched);
        $this->assertEquals(Video::RATING_LIST[0], $video->rating);
        $this->assertEquals(90, $video->duration);
        $this->assertFalse($video->opened);
        $this->assertDatabaseHas(
            'videos',
            $this->data + $this->fileFields + ['opened' => false]
        );

        $video = Video::create($this->data + ['opened' => true]);
        $video->refresh();

        $this->assertTrue($video->opened);
        $this->assertDatabaseHas('videos', $this->data + ['opened' => true]);
    }

    public function testCreateWithRelations()
    {
        $category = Category::factory()->create();
        $genre = Genre::factory()->create();

        $video = Video::create($this->data + [
           'categories' => [$category->id],
           'genres' => [$genre->id]
        ]);

        $this->assertHasCategory($video->id, $category->id);
        $this->assertHasGenre($video->id, $genre->id);
    }

    public function testUpdateWithBasicFields()
    {
        $updatedData = [
            'title' => 'updated_title',
            'description' => 'updated_description',
            'year_launched' => 2022,
            'rating' => Video::RATING_LIST[1],
            'duration' => 30,
            'opened' => false
        ];
        $this->video->update($updatedData + $this->fileFields);

        foreach ($updatedData as $key => $value) {
            $this->assertEquals($value, $this->video->{$key});
        }
        $this->assertDatabaseHas('videos', $updatedData + $this->fileFields);
    }

    public function testUpdateWithRelations()
    {
        $category = Category::factory()->create();
        $genre = Genre::factory()->create();

        $updatedData = [
            'title' => 'updated_title',
            'description' => 'updated_description',
            'year_launched' => 2022,
            'rating' => Video::RATING_LIST[1],
            'duration' => 30,
            'categories' => [$category->id],
            'genres' => [$genre->id]
        ];
        $this->video->update($updatedData);

        $this->assertHasCategory($this->video->id, $category->id);
        $this->assertHasGenre($this->video->id, $genre->id);
    }

    public function testDelete()
    {
        $this->video->delete();
        $this->video->refresh();

        $this->assertNotNull($this->video->deleted_at);
        $this->assertNull(Video::find($this->video->id));
    }

    public function testRestore()
    {
        $this->video = Video::factory()->create();

        $this->video->delete();
        $this->video->refresh();

        $this->assertNotNull($this->video->deleted_at);
        $this->assertNull(Video::find($this->video->id));

        $this->video->restore();

        $this->assertNotNull(Video::find($this->video->id));
    }

    public function testSyncCategories()
    {
        $categoriesId = Category::factory()->count(3)->create()
            ->pluck('id')
            ->toArray();
        $video = Video::factory()->create();

        Video::handleRelations($video, [
            'categories' => [$categoriesId[0]]
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[0],
            'video_id' => $video->id
        ]);

        Video::handleRelations($video, [
            'categories' => [$categoriesId[1], $categoriesId[2]]
        ]);
        $this->assertDatabaseMissing('category_video', [
            'category_id' => $categoriesId[0],
            'video_id' => $video->id
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[1],
            'video_id' => $video->id
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[2],
            'video_id' => $video->id
        ]);
    }

    public function testSyncGenres()
    {
        $genresId = Genre::factory()->count(3)->create()
            ->pluck('id')
            ->toArray();
        $video = Video::factory()->create();

        Video::handleRelations($video, [
            'genres' => [$genresId[0]]
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[0],
            'video_id' => $video->id
        ]);

        Video::handleRelations($video, [
            'genres' => [$genresId[1], $genresId[2]]
        ]);
        $this->assertDatabaseMissing('genre_video', [
            'genre_id' => $genresId[0],
            'video_id' => $video->id
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[1],
            'video_id' => $video->id
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[2],
            'video_id' => $video->id
        ]);
    }

    public function testRollbackCreate()
    {
        $hasError = false;
        try {
            Video::create($this->data + ['categories' => [0, 1, 2]]);
        } catch (QueryException $exception) {
            $this->assertCount(1, Video::all());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testRollbackUpdate()
    {
        $hasError = false;
        $title = $this->video->title;
        try {
            $this->video->update([
                'title' => 'updated_title',
                'description' => 'updated_description',
                'year_launched' => 2022,
                'rating' => Video::RATING_LIST[1],
                'duration' => 30,
                'categories' => [0, 1, 2]
            ]);
        } catch (QueryException $exception) {
            $this->assertDatabaseHas('videos', [
                'title' => $title
            ]);
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testHandleRelations()
    {
        $video = Video::factory()->create();

        Video::handleRelations($video, []);
        $this->assertCount(0, $video->categories);
        $this->assertCount(0, $video->genres);

        $category = Category::factory()->create();
        Video::handleRelations($video, [
            'categories' => [$category->id]
        ]);
        $video->refresh();
        $this->assertCount(1, $video->categories);

        $genre = Genre::factory()->create();
        Video::handleRelations($video, [
            'genres' => [$genre->id]
        ]);
        $video->refresh();
        $this->assertCount(1, $video->genres);

        $video->categories()->delete();
        $video->genres()->delete();

        Video::handleRelations($video, [
            'categories' => [$category->id],
            'genres' => [$genre->id]
        ]);
        $video->refresh();
        $this->assertCount(1, $video->categories);
        $this->assertCount(1, $video->genres);
    }

    protected function assertHasCategory($videoId, $categoryId)
    {
        $this->assertDatabaseHas('category_video', [
            'video_id' => $videoId,
            'category_id' => $categoryId
        ]);
    }

    protected function assertHasGenre($videoId, $genreId)
    {
        $this->assertDatabaseHas('genre_video', [
            'video_id' => $videoId,
            'genre_id' => $genreId
        ]);
    }
}
