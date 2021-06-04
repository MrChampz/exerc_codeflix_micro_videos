<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'year_launched' => $this->year_launched,
            'opened' => $this->opened,
            'rating' => $this->rating,
            'duration' => $this->duration,
            'categories' => $this->categories(),
            'genres' => $this->genres(),
            'cast_members' => $this->castMembers(),
            'video' => $this->file($this->video_file, $this->video_file_url),
            'trailer' => $this->file($this->trailer_file, $this->trailer_file_url),
            'thumb' => $this->file($this->thumb_file, $this->thumb_file_url),
            'banner' => $this->file($this->banner_file, $this->banner_file_url),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at
        ];
    }

    private function categories()
    {
        $categories = $this->categories->makeHidden('pivot');
        return CategoryResource::collection($categories);
    }

    private function genres()
    {
        $genres = $this->genres->load('categories')->makeHidden('pivot');
        return GenreResource::collection($genres);
    }

    private function castMembers()
    {
        $castMembers = $this->castMembers->makeHidden('pivot');
        return CastMemberResource::collection($castMembers);
    }

    private function file($name, $url)
    {
        return [
            'name' => $name,
            'url' => $url
        ];
    }
}
