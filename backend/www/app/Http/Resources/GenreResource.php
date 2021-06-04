<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GenreResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'is_active' => $this->is_active,
            'categories' => $this->categories(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at
        ];
    }

    private function categories()
    {
        $categories = $this->whenLoaded('categories');
        if ($this->relationLoaded('categories')) {
            $categories->makeHidden('pivot');
        }
        return CategoryResource::collection($categories);
    }
}
