<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

abstract class BasicCrudController extends Controller
{
    protected $paginationSize = 15;

    protected abstract function rulesStore();

    protected abstract function rulesUpdate();

    protected abstract function model();

    protected abstract function resource();

    protected abstract function resourceCollection();

    public function index()
    {
        $data = !$this->paginationSize
            ? $this->model()::all()
            : $this->model()::paginate($this->paginationSize);
        $resourceCollectionClass = $this->resourceCollection();
        $refClass = new \ReflectionClass($resourceCollectionClass);
        return $refClass->isSubclassOf(ResourceCollection::class)
            ? new $resourceCollectionClass($data)
            : $resourceCollectionClass::collection($data);
    }

    public function show($id)
    {
        $obj = $this->findOrFail($id);
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function store(Request $request)
    {
        $params = $this->validate($request, $this->rulesStore());
        $obj = $this->model()::create($params);
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $params = $this->validate($request, $this->rulesUpdate());
        $obj->update($params);
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function destroy($id)
    {
        $obj = $this->findOrFail($id);
        $obj->delete();
        return response()->noContent();
    }

    public function findOrFail($id)
    {
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $model::where($keyName, $id)->firstOrFail();
    }
}
