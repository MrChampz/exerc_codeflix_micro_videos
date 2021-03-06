<?php
declare(strict_types=1);

namespace Tests\Traits;

use Illuminate\Testing\TestResponse;

trait TestSaves
{
    protected abstract function model();

    protected abstract function routeStore();

    protected abstract function routeUpdate();

    protected function assertStore(array $sendData, array $testDatabase, array $testJsonData = null): TestResponse
    {
        $response = $this->json('POST', $this->routeStore(), $sendData);
        if ($response->status() !== 201) {
            throw new \Exception("Response status must be 201, given " .
                "{$response->status()}:\n{$response->content()}");
        }
        $this->assertInDatabase($response, $testDatabase);
        $this->assertJsonResponseContent($response, $testDatabase, $testJsonData);
        return $response;
    }

    protected function assertUpdate(array $sendData, array $testDatabase, array $testJsonData = null): TestResponse
    {
        $response = $this->json('PUT', $this->routeUpdate(), $sendData);
        if ($response->status() !== 200) {
            throw new \Exception("Response status must be 200, given " .
                "{$response->status()}:\n{$response->content()}");
        }
        $this->assertInDatabase($response, $testDatabase);
        $this->assertJsonResponseContent($response, $testDatabase, $testJsonData);
        return $response;
    }

    private function assertInDatabase(TestResponse $response, array $testDatabase)
    {
        $id = ['id' => $response->json('id')];
        $model = $this->model();
        $table = (new $model)->getTable();
        $this->assertDatabaseHas($table, $testDatabase + $id);
    }

    private function assertJsonResponseContent(TestResponse $response, array $testDatabase, array $testJsonData = null)
    {
        $id = ['id' => $response->json('id')];
        $testResponse = $testJsonData ?? $testDatabase;
        $response->assertJsonFragment($testResponse + $id);
    }
}
