<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CategoryControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;

    private $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = Category::factory()->create([
            'description' => 'test description',
            'is_active' => false
        ]);
    }

    public function testIndex()
    {
        $response = $this->get(route('categories.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$this->category->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route(
            'categories.show',
            ['category' => $this->category->id]
        ));

        $response
            ->assertStatus(200)
            ->assertJson($this->category->toArray());
    }

    public function testStore()
    {
        $data = ['name' => 'test'];
        $this->assertStore($data, $data + [
            'description' => null,
            'is_active' => true,
            'deleted_at' => null
        ])->assertJsonStructure([
            'created_at',
            'updated_at'
        ]);

        $data = [
            'name' => 'test',
            'description' => 'test description',
            'is_active' => false
        ];
        $this->assertStore($data, $data + [
            'description' => 'test description',
            'is_active' => false
        ]);
    }

    public function testUpdate()
    {
        $data = [
            'name' => 'test',
            'description' => 'test',
            'is_active' => true
        ];
        $this->assertUpdate($data, $data + [
            'deleted_at' => null
        ])->assertJsonStructure([
            'created_at',
            'updated_at'
        ]);

        $data = [
            'name' => 'test',
            'description' => ''
        ];
        $this->assertUpdate($data, array_merge($data, ['description' => null]));

        $data['description'] = null;
        $this->assertUpdate($data, $data);

        $data['description'] = 'test';
        $this->assertUpdate($data, $data);
    }

    public function testDestroy()
    {
        $response = $this->json(
            'DELETE',
            route('categories.destroy', ['category' => $this->category->id]),
            []
        );

        $response->assertNoContent();
        $this->assertNull(Category::find($this->category->id));
        $this->assertNotNull(Category::withTrashed()->find($this->category->id));
    }

    public function testInvalidationData()
    {
        $data = ['name' => ''];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');

        $data = ['name' => str_repeat('a', 256)];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

        $data = ['is_active' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');
    }

    protected function routeStore()
    {
        return route('categories.store');
    }

    protected function routeUpdate()
    {
        return route('categories.update', ['category' => $this->category->id]);
    }

    protected function model()
    {
        return Category::class;
    }
}
