<?php

namespace Database\Seeders;

use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

class VideosTableSeeder extends Seeder
{
    private $allGenres;
    private $relations;

    public function run()
    {
        $dir = \Storage::getDriver()->getAdapter()->getPathPrefix();
        \File::deleteDirectory($dir, true);

        $self = $this;
        $this->allGenres = Genre::all();

        Model::reguard();
        Video::factory()->count(100)->make()
            ->each(function (Video $video) use ($self) {
                $self->fetchRelations();
                Video::create(
                    array_merge(
                        $video->toArray(),
                        [
                            'thumb_file' => $self->getImageFile(),
                            'banner_file' => $self->getImageFile(),
                            'trailer_file' => $self->getVideoFile(),
                            'video_file' => $self->getVideoFile(),
                        ],
                        $this->relations
                    )
                );
            });
        Model::unguard();
    }

    public function fetchRelations()
    {
        $subGenres = $this->allGenres->random(5)->load('categories');
        $genresId = $subGenres->pluck('id')->toArray();
        $categoriesId = [];
        foreach ($subGenres as $genre) {
            array_push(
                $categoriesId,
                ...$genre->categories()->pluck('id')->toArray()
            );
        }
        $categoriesId = array_unique($categoriesId);
        $this->relations['categories'] = $categoriesId;
        $this->relations['genres'] = $genresId;
    }

    public function getImageFile()
    {
        return new UploadedFile(
            storage_path('faker/thumbs/Sample Image.jpg'),
            'Sample Image.jpg'
        );
    }

    public function getVideoFile()
    {
        return new UploadedFile(
            storage_path('faker/videos/01 - Sample Video.mp4'),
            '01 - Sample Video.mp4'
        );
    }
}