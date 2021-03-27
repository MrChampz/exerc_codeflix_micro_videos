<?php

namespace Tests\Prod\Models\Video;

use App\Models\Video;
use Illuminate\Database\Events\TransactionCommitted;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\UploadedFile;
use Tests\Exceptions\TestException;
use Tests\TestCase;
use Tests\Traits\TestProd;

class VideoUploadProdTest extends TestCase
{
    use DatabaseMigrations, TestProd;

    protected function setUp(): void
    {
        parent::setUp();
        $this->skipTestIfNotProd();
    }

    public function testFileUrlsWithS3Driver()
    {
        $fileFields = [];
        foreach (Video::$fileFields as $field) {
            $fileFields[$field] = "$field.test";
        }
        $video = Video::factory()->create($fileFields);
        $baseUrl = config('filesystems.disks.s3.url');
        \Config::set('filesystems.default', 's3');
        
        foreach ($fileFields as $field => $value) {
            $fileUrl = $video->{"{$field}_url"};
            $this->assertEquals("{$baseUrl}/$video->id/$value", $fileUrl);
        }
    }
}
