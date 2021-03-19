<?php

namespace App\Http\Controllers\Api;

use App\Models\Video;
use App\Rules\GenresHasCategoriesRule;
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
            'categories' => 'required|array|exists:categories,id,deleted_at,NULL',
            'genres' => ['required', 'array', 'exists:genres,id,deleted_at,NULL'],
            'video_file' => 'required'
        ];
    }

    public function store(Request $request)
    {
        $this->addGenreHasCategoriesRule($request);
        $params = $this->validate($request, $this->rulesStore());
        $video = $this->model()::create($params);
        $video->refresh();
        return $video;
    }

    public function update(Request $request, $id)
    {
        $video = $this->findOrFail($id);
        $this->addGenreHasCategoriesRule($request);
        $params = $this->validate($request, $this->rulesUpdate());
        $video->update($params);
        return $video;
    }

    protected function addGenreHasCategoriesRule(Request $request)
    {
        $categoriesId = $request->get('categories');
        $categoriesId = is_array($categoriesId) ? $categoriesId : [];
        $this->rules['genres'][] = new GenresHasCategoriesRule($categoriesId);
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
