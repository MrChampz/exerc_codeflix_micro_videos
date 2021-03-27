<?php

namespace Tests\Traits;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Testing\TestResponse;

trait TestResources
{
    protected function assertResource(TestResponse $response, JsonResource $resource)
    {
        $data = $resource->response()->getData(true);
        $response->assertJson($data);
    }
}