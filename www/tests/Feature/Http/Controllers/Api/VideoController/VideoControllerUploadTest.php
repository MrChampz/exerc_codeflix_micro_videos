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
        UploadedFile::fake()->image("image.jpg");
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
            12,
            'mimetypes', ['values' => 'video/mp4']
        );
    }

    protected function getFiles()
    {
        return [
            'video_file' => UploadedFile::fake()->create('video_file.mp4')
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
