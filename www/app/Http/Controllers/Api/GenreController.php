<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\GenreResource;
use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends BasicCrudController
{
    private $rules = [
        'name' => 'required|max:255|',
        'is_active' => 'boolean',
        'categories' => 'required|array|exists:categories,id,deleted_at,NULL'
    ];

    public function store(Request $request)
    {
        $params = $this->validate($request, $this->rulesStore());
        $self = $this;
        $genre = \DB::transaction(function () use ($request, $params, $self) {
            $genre = $this->model()::create($params);
            $self->handleRelations($genre, $request);
            return $genre;
        });
        $genre->load('categories');
        $genre->refresh();
        $resource = $this->resource();
        return new $resource($genre);
    }

    public function update(Request $request, $id)
    {
        $genre = $this->findOrFail($id);
        $params = $this->validate($request, $this->rulesUpdate());
        $self = $this;
        $genre = \DB::transaction(function () use ($request, $params, $self, $genre) {
            $genre->update($params);
            $self->handleRelations($genre, $request);
            return $genre;
        });
        $resource = $this->resource();
        return new $resource($genre);
    }

    protected function handleRelations(Genre $genre, Request $request)
    {
        $genre->categories()->sync($request->get('categories'));
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
        return Genre::class;
    }

    protected function resource()
    {
        return GenreResource::class;
    }

    protected function resourceCollection()
    {
        return $this->resource();
    }

    protected function queryBuilder(): Builder
    {
        return parent::queryBuilder()->with('categories');
    }
}
