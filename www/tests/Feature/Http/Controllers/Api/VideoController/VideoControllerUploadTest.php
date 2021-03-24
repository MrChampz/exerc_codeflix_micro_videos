<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Http\UploadedFile;
use Tests\Traits\TestUploads;
use Tests\Traits\TestValidations;

class VideoControllerUploadTest extends BaseVideoControllerTestCase
{
    use TestValidations, TestUploads;

    public function testStoreWithFiles()
    {
        \Storage::fake();
        $files = $this->getFiles();

        $category = Category::factory()->create();
        $genre = Genre::factory()->create();
        $genre->categories()->sync($category->id);

        $response = $this->json(
            'POST',
            $this->routeStore(),
            $this->sendData + [
                'categories' => [$category->id],
                'genres' => [$genre->id]
            ] + $files
        );
        $response->assertStatus(201);

        $id = $response->json('id');
        foreach ($files as $file) {
            \Storage::assertExists("$id/{$file->hashName()}");
        }
    }

    public function testUpdateWithFiles()
    {
        \Storage::fake();
        $files = $this->getFiles();

        $category = Category::factory()->create();
        $genre = Genre::factory()->create();
        $genre->categories()->sync($category->id);

        $response = $this->json(
            'PUT',
            $this->routeUpdate(),
            $this->sendData + [
                'categories' => [$category->id],
                'genres' => [$genre->id]
            ] + $files
        );
        $response->assertStatus(200);

        $id = $response->json('id');
        foreach ($files as $file) {
            \Storage::assertExists("$id/{$file->hashName()}");
        }
    }

    public function testInvalidationVideoField()
    {
        $this->assertInvalidationFile(
            'video_file',
            'mp4',
            52428800,
            'mimetypes', ['values' => 'video/mp4']
        );
    }

    public function testInvalidationTrailerField()
    {
        $this->assertInvalidationFile(
            'trailer_file',
            'mp4',
            1048576,
            'mimetypes', ['values' => 'video/mp4']
        );
    }

    public function testInvalidationThumbField()
    {
        $this->assertInvalidationFile(
            'thumb_file',
            'mp4',
            5120,
            'image'
        );
    }

    public function testInvalidationBannerField()
    {
        $this->assertInvalidationFile(
            'banner_file',
            'mp4',
            10240,
            'image'
        );
    }

    protected function getFiles()
    {
        return [
            'video_file' => UploadedFile::fake()->create('video_file.mp4'),
            'trailer_file' => UploadedFile::fake()->create('trailer_file.mp4'),
            'thumb_file' => UploadedFile::fake()->image('thumb_file.jpg'),
            'banner_file' => UploadedFile::fake()->image('banner_file.jpg'),
        ];
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model()
    {
        return Video::class;
    }
}
