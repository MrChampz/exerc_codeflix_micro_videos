<?php

namespace Tests\Unit\Models\Traits;

use Illuminate\Http\UploadedFile;
use Tests\Stubs\Models\UploadFilesStub;
use Tests\TestCase;

class UploadFilesUnitTest extends TestCase
{
    private $trait;

    protected function setUp(): void
    {
        parent::setUp();
        $this->trait = new UploadFilesStub();
    }

    public function testUploadFile()
    {
        \Storage::fake();
        $file = UploadedFile::fake()->create('video.mp4');

        $this->trait->uploadFile($file);

        \Storage::assertExists("1/{$file->hashName()}");
    }

    public function testUploadFiles()
    {
        \Storage::fake();
        $file1 = UploadedFile::fake()->create('video1.mp4');
        $file2 = UploadedFile::fake()->create('video2.mp4');

        $this->trait->uploadFiles([$file1, $file2]);

        \Storage::assertExists("1/{$file1->hashName()}");
        \Storage::assertExists("1/{$file2->hashName()}");
    }

    public function testDeleteFile()
    {
        \Storage::fake();

        $file = UploadedFile::fake()->create('video.mp4');
        $filename = $file->hashName();

        $this->trait->uploadFile($file);
        $this->trait->deleteFile($filename);
        \Storage::assertMissing("1/{$filename}");

        $file = UploadedFile::fake()->create('video.mp4');
        $filename = $file->hashName();

        $this->trait->uploadFile($file);
        $this->trait->deleteFile($file);
        \Storage::assertMissing("1/{$filename}");
    }

    public function testDeleteFiles()
    {
        \Storage::fake();
        $file1 = UploadedFile::fake()->create('video1.mp4');
        $file2 = UploadedFile::fake()->create('video2.mp4');

        $this->trait->uploadFiles([$file1, $file2]);
        $this->trait->deleteFiles([$file1->hashName(), $file2]);

        \Storage::assertMissing("1/{$file1->hashName()}");
        \Storage::assertMissing("1/{$file2->hashName()}");
    }

    public function testExtractFiles()
    {
        $attributes = [];
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertCount(0, $attributes);
        $this->assertCount(0, $files);

        $data = ['film' => 'film_test'];
        $attributes = $data;
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertCount(1, $attributes);
        $this->assertEquals($data, $attributes);
        $this->assertCount(0, $files);

        $data = ['film' => 'film_test', 'trailer' => 'trailer_test'];
        $attributes = $data;
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertCount(2, $attributes);
        $this->assertEquals($data, $attributes);
        $this->assertCount(0, $files);

        $movie = UploadedFile::fake()->create('movie.mp4');
        $attributes = ['film' => $movie, 'other' => 'test'];
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertCount(2, $attributes);
        $this->assertEquals([
            'film' => $movie->hashName(),
            'other' => 'test'
        ], $attributes);
        $this->assertEquals([$movie], $files);

        $trailer = UploadedFile::fake()->create('trailer.mp4');
        $attributes = ['film' => $movie, 'trailer' => $trailer, 'other' => 'test'];
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertCount(3, $attributes);
        $this->assertEquals([
            'film' => $movie->hashName(),
            'trailer' => $trailer->hashName(),
            'other' => 'test'
        ], $attributes);
        $this->assertEquals([$movie, $trailer], $files);
    }
}
