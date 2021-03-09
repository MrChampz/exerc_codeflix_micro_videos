<?php

namespace App\Http\Controllers\Api;

use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends BasicCrudController
{
    private $rules;

    public function __construct()
    {
        $this->rules = [
            'title' => 'required|max:255',
            'description' => 'required',
            'year_launched' => 'required|date_format:Y',
            'opened' => 'boolean',
            'rating' => 'required|in:' . implode(',', Video::RATING_LIST),
            'duration' => 'required|integer',
            'categories' => 'required|array|exists:categories,id',
            'genres' => 'required|array|exists:genres,id'
        ];
    }

    public function store(Request $request)
    {
        $params = $this->validate($request, $this->rulesStore());
        $self = $this;
        $video = \DB::transaction(function () use ($request, $params, $self) {
            $video = $this->model()::create($params);
            $self->handleRelations($video, $request);
            return $video;
        });
        $video->refresh();
        return $video;
    }

    public function update(Request $request, $id)
    {
        $video = $this->findOrFail($id);
        $params = $this->validate($request, $this->rulesUpdate());
        $self = $this;
        $video = \DB::transaction(function () use ($request, $params, $self, $video) {
            $video->update($params);
            $self->handleRelations($video, $request);
            return $video;
        });
        return $video;
    }

    protected function handleRelations(Video $video, Request $request)
    {
        $video->categories()->sync($request->get('categories'));
        $video->genres()->sync($request->get('genres'));
    }

    protected function model()
    {
        return Video::class;
    }

    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }
}
