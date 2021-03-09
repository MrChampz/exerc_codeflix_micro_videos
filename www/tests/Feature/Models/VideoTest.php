<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Ramsey\Uuid\Validator\GenericValidator;
use Tests\TestCase;

class VideoTest extends TestCase
{
    use DatabaseMigrations;

    private $uuidValidator;
    private $video;
    private $data;

    public function setUp(): void
    {
        parent::setUp();
        $this->uuidValidator = new GenericValidator();
        $this->data = [
            'title' => 'title',
            'description' => 'description',
            'year_launched' => 2010,
            'rating' => Video::RATING_LIST[0],
            'duration' => 90
        ];
        $this->video = Video::factory()->create($this->data);
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
                'created_at',
                'updated_at',
                'deleted_at'
            ],
            $videoKeys
        );
    }

    public function testCreate()
    {
        $video = Video::create($this->data);
        $video->refresh();

        $this->assertTrue($this->uuidValidator->validate($video->id));
        $this->assertEquals('title', $video->title);
        $this->assertEquals('description', $video->description);
        $this->assertEquals(2010, $video->year_launched);
        $this->assertEquals(Video::RATING_LIST[0], $video->rating);
        $this->assertEquals(90, $video->duration);
        $this->assertFalse($video->opened);

        $video = Video::create($this->data + ['opened' => true]);
        $video->refresh();

        $this->assertTrue($video->opened);
    }

    public function testUpdate()
    {
        $data = [
            'title' => 'updated_title',
            'description' => 'updated_description',
            'year_launched' => 2022,
            'rating' => Video::RATING_LIST[1],
            'duration' => 30
        ];
        $this->video->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $this->video->{$key});
        }
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
}
