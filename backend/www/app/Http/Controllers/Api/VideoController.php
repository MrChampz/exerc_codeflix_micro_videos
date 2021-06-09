<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Rules\GenresHasCategoriesRule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class VideoController extends BasicCrudController
{
    private $rules;

    public function __construct()
    {
        $this->rules = [
            'title' => 'required|max:255',
            'description' => 'required',
            'year_launched' => 'required|date_format:Y|min:1',
            'opened' => 'boolean',
            'rating' => 'required|in:' . implode(',', Video::RATING_LIST),
            'duration' => 'required|integer|min:1',
            'categories' => 'required|array|exists:categories,id,deleted_at,NULL',
            'genres' => ['required','array','exists:genres,id,deleted_at,NULL'],
            'cast_members' => 'required|array|exists:cast_members,id,deleted_at,NULL',
            'video_file' => 'mimetypes:video/mp4|max:' . Video::VIDEO_FILE_MAX_SIZE,
            'trailer_file' => 'mimetypes:video/mp4|max:' . Video::TRAILER_FILE_MAX_SIZE,
            'thumb_file' => 'image|max:' . Video::THUMB_FILE_MAX_SIZE,
            'banner_file' => 'image|max:' . Video::BANNER_FILE_MAX_SIZE,
        ];
    }

    public function store(Request $request)
    {
        $this->addGenreHasCategoriesRule($request);
        $params = $this->validate($request, $this->rulesStore());
        $video = $this->model()::create($params);
        $video->refresh();
        $resource = $this->resource();
        return new $resource($video);
    }

    public function update(Request $request, $id)
    {
        $video = $this->findOrFail($id);
        $this->addGenreHasCategoriesRule($request);
        $params = $this->validate(
            $request,
            $request->isMethod('PUT') ? $this->rulesUpdate() : $this->rulesPatch()
        );
        $video->update($params);
        $resource = $this->resource();
        return new $resource($video);
    }

    protected function addGenreHasCategoriesRule(Request $request)
    {
        $categoriesId = $request->get('categories');
        $categoriesId = is_array($categoriesId) ? $categoriesId : [];
        $this->rules['genres'][] = new GenresHasCategoriesRule($categoriesId);
    }

    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }

    protected function model()
    {
        return Video::class;
    }
    
    protected function resource()
    {
        return VideoResource::class;
    }
    
    protected function resourceCollection()
    {
        return $this->resource();
    }

    protected function queryBuilder(): Builder
    {
        return parent::queryBuilder()
            ->with('categories')
            ->with('genres')
            ->with('castMembers');
    }
}
