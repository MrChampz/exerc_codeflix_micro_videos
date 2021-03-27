<?php

namespace Tests\Feature\Models\Video;

use App\Models\Video;
use Illuminate\Database\Events\TransactionCommitted;
use Illuminate\Http\UploadedFile;
use Tests\Exceptions\TestException;

class VideoUploadTest extends BaseVideoTestCase
{
    public function testCreateWithFiles()
    {
        \Storage::fake();
        $video = Video::create(
            $this->data + [
                'video_file' => UploadedFile::fake()
                    ->create('video.mp4')
                    ->mimeType('video/mp4'),
                'trailer_file' => UploadedFile::fake()
                    ->create('trailer.mp4')
                    ->mimeType('video/mp4'),
                'thumb_file' => UploadedFile::fake()->image('thumb.jpg'),
                'banner_file' => UploadedFile::fake()->image('banner.jpg'),
            ]
        );

        \Storage::assertExists("{$video->id}/{$video->video_file}");
        \Storage::assertExists("{$video->id}/{$video->trailer_file}");
        \Storage::assertExists("{$video->id}/{$video->thumb_file}");
        \Storage::assertExists("{$video->id}/{$video->banner_file}");
    }

    public function testCreateRollbackFiles()
    {
        \Storage::fake();
        \Event::listen(TransactionCommitted::class, function () {
            throw new TestException();
        });
        $hasError = false;

        try {
             Video::create(
                $this->data + [
                    'video_file' => UploadedFile::fake()
                        ->create('video.mp4')
                        ->mimeType('video/mp4'),
                    'trailer_file' => UploadedFile::fake()
                        ->create('trailer.mp4')
                        ->mimeType('video/mp4'),
                    'thumb_file' => UploadedFile::fake()->image('thumb.jpg'),
                    'banner_file' => UploadedFile::fake()->image('banner.jpg'),
                ]
            );
        } catch (TestException $e) {
            $this->assertCount(0, \Storage::allFiles());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testUpdateWithFiles()
    {
        \Storage::fake();
        $video = Video::factory()->create();
        $thumbFile = UploadedFile::fake()->image("thumb.jpg");
        $videoFile = UploadedFile::fake()
            ->create("video.mp4")
            ->mimeType('video/mp4');
        $trailerFile = UploadedFile::fake()
            ->create("trailer.mp4")
            ->mimeType('video/mp4');
        $thumbFile = UploadedFile::fake()->image("thumb.jpg");
        $bannerFile = UploadedFile::fake()->image("banner.jpg");

        $video->update($this->data + [
            'video_file' => $videoFile,
            'trailer_file' => $trailerFile,
            'thumb_file' => $thumbFile,
            'banner_file' => $bannerFile,
        ]);

        \Storage::assertExists("{$video->id}/{$video->video_file}");
        \Storage::assertExists("{$video->id}/{$video->trailer_file}");
        \Storage::assertExists("{$video->id}/{$video->thumb_file}");
        \Storage::assertExists("{$video->id}/{$video->banner_file}");

        $newVideoFile = UploadedFile::fake()
            ->create('video.mp4')
            ->mimetype('video/mp4');
        $newBannerFile = UploadedFile::fake()->image('banner.png');
        $video->update($this->data + [
            'video_file' => $newVideoFile,
            'banner_file' => $newBannerFile,
        ]);
        
        \Storage::assertExists("{$video->id}/{$thumbFile->hashName()}");
        \Storage::assertExists("{$video->id}/{$trailerFile->hashName()}");

        \Storage::assertExists("{$video->id}/{$newVideoFile->hashName()}");
        \Storage::assertMissing("{$video->id}/{$videoFile->hashName()}");

        \Storage::assertExists("{$video->id}/{$newBannerFile->hashName()}");
        \Storage::assertMissing("{$video->id}/{$bannerFile->hashName()}");
    }

    public function testUpdateRollbackFiles()
    {
        \Storage::fake();
        \Event::listen(TransactionCommitted::class, function () {
            throw new TestException();
        });
        $video = Video::factory()->create();
        $hasError = false;

        try {
            $video->update(
                $this->data + [
                    'video_file' => UploadedFile::fake()
                        ->create('video.mp4')
                        ->mimeType('video/mp4'),
                    'trailer_file' => UploadedFile::fake()
                        ->create('trailer.mp4')
                        ->mimeType('video/mp4'),
                    'thumb_file' => UploadedFile::fake()->image('thumb.jpg'),
                    'banner_file' => UploadedFile::fake()->image('banner.jpg'),
                ]
            );
        } catch (TestException $e) {
            $this->assertCount(0, \Storage::allFiles());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testFileUrlsWithLocalDriver()
    {
        $fileFields = [];
        foreach (Video::$fileFields as $field) {
            $fileFields[$field] = "$field.test";
        }
        $video = Video::factory()->create($fileFields);
        $localDriver = config('filesystems.default');
        $baseUrl = config('filesystems.disks.' . $localDriver)['url'];

        foreach ($fileFields as $field => $value) {
            $fileUrl = $video->{"{$field}_url"};
            $this->assertEquals("{$baseUrl}/$video->id/$value", $fileUrl);
        }
    }

    public function testFileUrlsEmptinessWhenFieldsAreNull()
    {
        $video = Video::factory()->create();
        foreach (Video::$fileFields as $field) {
            $fileUrl = $video->{"{$field}_url"};
            $this->assertEquals("", $fileUrl);
        }
    }
}
