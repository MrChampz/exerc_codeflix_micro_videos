<?php

namespace Tests\Unit\Models\Traits;

use Illuminate\Http\UploadedFile;
use Tests\Stubs\Models\UploadFilesStub;
use Tests\TestCase;

class UploadFilesUnitTest extends TestCase
{
    private $obj;

    protected function setUp(): void
    {
        parent::setUp();
        $this->obj = new UploadFilesStub();
    }

    public function testRelativeFilePath()
    {
        $this->assertEquals("1/video.mp4", $this->obj->relativeFilePath('video.mp4'));
    }

    public function testUploadFile()
    {
        \Storage::fake();
        $file = UploadedFile::fake()->create('video.mp4');

        $this->obj->uploadFile($file);

        \Storage::assertExists("1/{$file->hashName()}");
    }

    public function testUploadFiles()
    {
        \Storage::fake();
        $file1 = UploadedFile::fake()->create('video1.mp4');
        $file2 = UploadedFile::fake()->create('video2.mp4');

        $this->obj->uploadFiles([$file1, $file2]);

        \Storage::assertExists("1/{$file1->hashName()}");
        \Storage::assertExists("1/{$file2->hashName()}");
    }

    public function testDeleteOldFiles()
    {
        \Storage::fake();
        $file1 = UploadedFile::fake()->create('video1.mp4')->size(1);
        $file2 = UploadedFile::fake()->create('video2.mp4')->size(1);
        $this->obj->uploadFiles([$file1, $file2]);
        $this->obj->deleteOldFiles();
        $this->assertCount(2, \Storage::allFiles());

        $this->obj->oldFiles = [$file1->hashName()];
        $this->obj->deleteOldFiles();
        \Storage::assertMissing("1/{$file1->hashName()}");
        \Storage::assertExists("1/{$file2->hashName()}");
    }

    public function testDeleteFile()
    {
        \Storage::fake();

        $file = UploadedFile::fake()->create('video.mp4');
        $filename = $file->hashName();

        $this->obj->uploadFile($file);
        $this->obj->deleteFile($filename);
        \Storage::assertMissing("1/{$filename}");

        $file = UploadedFile::fake()->create('video.mp4');
        $filename = $file->hashName();

        $this->obj->uploadFile($file);
        $this->obj->deleteFile($file);
        \Storage::assertMissing("1/{$filename}");
    }

    public function testDeleteFiles()
    {
        \Storage::fake();
        $file1 = UploadedFile::fake()->create('video1.mp4');
        $file2 = UploadedFile::fake()->create('video2.mp4');

        $this->obj->uploadFiles([$file1, $file2]);
        $this->obj->deleteFiles([$file1->hashName(), $file2]);

        \Storage::assertMissing("1/{$file1->hashName()}");
        \Storage::assertMissing("1/{$file2->hashName()}");
    }

    public function testGetFileUrl()
    {
        \Storage::fake();
        $file = UploadedFile::fake()->create('video.mp4');

        $this->obj->uploadFile($file);
        $url = $this->obj->getFileUrl($file->hashName());

        $this->assertEquals("/storage/1/{$file->hashName()}", $url);

        $url = $this->obj->getFileUrl('');
        $this->assertEquals('', $url);

        $url = $this->obj->getFileUrl(null);
        $this->assertEquals('', $url);
    }

    public function testExtractFiles()
    {
        $attributes = [];
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertCount(0, $attributes);
        $this->assertCount(0, $files);

        $data = ['file1' => 'film_test'];
        $attributes = $data;
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertCount(1, $attributes);
        $this->assertEquals($data, $attributes);
        $this->assertCount(0, $files);

        $data = ['file1' => 'film_test', 'file2' => 'trailer_test'];
        $attributes = $data;
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertCount(2, $attributes);
        $this->assertEquals($data, $attributes);
        $this->assertCount(0, $files);

        $file1 = UploadedFile::fake()->create('video1.mp4');
        $attributes = ['file1' => $file1, 'other' => 'test'];
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertCount(2, $attributes);
        $this->assertEquals([
            'file1' => $file1->hashName(),
            'other' => 'test'
        ], $attributes);
        $this->assertEquals([$file1], $files);

        $file2 = UploadedFile::fake()->create('video2.mp4');
        $attributes = ['file1' => $file1, 'file2' => $file2, 'other' => 'test'];
        $files = UploadFilesStub::extractFiles($attributes);
        $this->assertCount(3, $attributes);
        $this->assertEquals([
            'file1' => $file1->hashName(),
            'file2' => $file2->hashName(),
            'other' => 'test'
        ], $attributes);
        $this->assertEquals([$file1, $file2], $files);
    }
}
