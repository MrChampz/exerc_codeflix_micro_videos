<?php

namespace Tests\Prod\Models\Traits;

use Illuminate\Http\UploadedFile;
use Tests\Stubs\Models\UploadFilesStub;
use Tests\TestCase;
use Tests\Traits\TestProd;
use Tests\Traits\TestStorages;

class UploadFilesProdTest extends TestCase
{
    use TestStorages, TestProd;

    private $obj;
    private $baseUrl;

    protected function setUp(): void
    {
        parent::setUp();
        $this->skipTestIfNotProd();
        
        $this->obj = new UploadFilesStub();
        \Config::set('filesystems.default', 's3');
        $this->deleteAllFiles();
        
        $this->baseUrl = config('filesystems.disks.s3.url');
    }

    public function testUploadFile()
    {
        $file = UploadedFile::fake()->create('video.mp4');

        $this->obj->uploadFile($file);

        \Storage::assertExists("1/{$file->hashName()}");
    }

    public function testUploadFiles()
    {
        $file1 = UploadedFile::fake()->create('video1.mp4');
        $file2 = UploadedFile::fake()->create('video2.mp4');

        $this->obj->uploadFiles([$file1, $file2]);

        \Storage::assertExists("1/{$file1->hashName()}");
        \Storage::assertExists("1/{$file2->hashName()}");
    }

    public function testDeleteOldFiles()
    {
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
        $file1 = UploadedFile::fake()->create('video1.mp4');
        $file2 = UploadedFile::fake()->create('video2.mp4');

        $this->obj->uploadFiles([$file1, $file2]);
        $this->obj->deleteFiles([$file1->hashName(), $file2]);

        \Storage::assertMissing("1/{$file1->hashName()}");
        \Storage::assertMissing("1/{$file2->hashName()}");
    }

    public function testGetFileUrl()
    {
        $file = UploadedFile::fake()->create('video.mp4');

        $this->obj->uploadFile($file);
        $url = $this->obj->getFileUrl($file->hashName());

        $this->assertEquals("{$this->baseUrl}/1/{$file->hashName()}", $url);
    }
}
