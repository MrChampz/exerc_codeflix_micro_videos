<?php

namespace Tests\Unit\Models;

use App\Models\Traits\UploadFiles;
use App\Models\Traits\Uuid;
use App\Models\Video;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class VideoUnitTest extends TestCase
{
    use DatabaseMigrations;

    private $video;

    protected function setUp(): void
    {
        parent::setUp();
        $this->video = new Video();
    }

    public function testTraits()
    {
        $traits = [
            HasFactory::class,
            SoftDeletes::class,
            Uuid::class,
            UploadFiles::class
        ];
        $videoTraits = array_keys(class_uses(Video::class));
        $this->assertEquals($traits, $videoTraits);
    }

    public function testIncrementingAttribute()
    {
        $this->assertFalse($this->video->getIncrementing());
    }

    public function testKeyTypeAttribute()
    {
        $this->assertEquals('string', $this->video->getKeyType());
    }

    public function testFillableAttribute()
    {
        $fillable = [
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
        ];
        $this->assertEqualsCanonicalizing($fillable, $this->video->getFillable());
    }

    public function testCastsAttribute()
    {
        $casts = [
            'opened' => 'boolean',
            'year_launched' => 'integer',
            'duration' => 'integer',
            'deleted_at' => 'datetime'
        ];
        $this->assertEquals($casts, $this->video->getCasts());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $this->assertEqualsCanonicalizing($dates, $this->video->getDates());
        $this->assertCount(count($dates), $this->video->getDates());
    }
}
