<?php

namespace Tests\Feature\Http\Controllers\Api;


use App\Http\Controllers\Api\GenreController;
use App\Http\Resources\GenreResource;
use App\Models\Category;
use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Tests\Exceptions\TestException;
use Tests\TestCase;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves, TestResources;

    private $genre;
    private $sendData;
    private $serializedFields = [
        'id',
        'name',
        'is_active',
        'categories' => [
            '*' => [
                'id',
                'name',
                'description',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at',
            ]
        ],
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->sendData = [
            'name' => 'test'
        ];
        $this->genre = Genre::factory()->create([
            'is_active' => true
        ]);
        $category = Category::factory()->create();
        $this->genre->categories()->attach($category);
    }

    public function testIndex()
    {
        $response = $this->get(route('genres.index'));
        
        $response
            ->assertStatus(200)
            ->assertJson([
                'meta' => ['per_page' => 15],
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => $this->serializedFields,
                ],
                'links' => [],
                'meta' => [],
            ]);

        $resource = GenreResource::collection(collect([$this->genre]));
        $this->assertResource($response, $resource);
    }

    public function testShow()
    {
        $response = $this->get(route(
            'genres.show',
            ['genre' => $this->genre->id]
        ));

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => $this->serializedFields
            ]);

        $id = $response->json('data.id');
        $resource = new GenreResource(Genre::find($id));
        $this->assertResource($response, $resource);
    }

    public function testSave()
    {
        $category = Category::factory()->create();

        $data = [
            [
                'send_data' => $this->sendData + [
                    'categories' => [$category->id]
                ],
                'test_data' => $this->sendData + ['is_active' => true]
            ],
            [
                'send_data' => $this->sendData + [
                    'is_active' => true,
                    'categories' => [$category->id]
                ],
                'test_data' => $this->sendData + ['is_active' => true]
            ],
            [
                'send_data' => $this->sendData + [
                    'is_active' => false,
                    'categories' => [$category->id]
                ],
                'test_data' => $this->sendData + ['is_active' => false]
            ]
        ];

        foreach ($data as $key => $value) {
            $response = $this->assertStore(
                $value['send_data'],
                $value['test_data'] + ['deleted_at' => null]
            );
            $id = $response->json('data.id');
            
            $response->assertStatus(201);
            $response->assertJsonStructure([
                'data' => $this->serializedFields
            ]);

            $this->assertHasCategory($id, $value['send_data']['categories'][0]);

            $resource = new GenreResource(Genre::find($id));
            $this->assertResource($response, $resource);
            
            $response = $this->assertUpdate(
                $value['send_data'],
                $value['test_data'] + ['deleted_at' => null]
            );
            $id = $response->json('data.id');
            
            $response->assertStatus(200);
            $response->assertJsonStructure([
                'data' => $this->serializedFields
            ]);
            
            $this->assertHasCategory($id, $value['send_data']['categories'][0]);
            
            $resource = new GenreResource(Genre::find($id));
            $this->assertResource($response, $resource);
        }
    }

    public function testSyncCategories()
    {
        $categoriesId = Category::factory()->count(3)->create()
            ->pluck('id')
            ->toArray();

        $response = $this->json(
            'POST',
            $this->routeStore(),
            $this->sendData + [
                'categories' => [$categoriesId[0]]
            ]
        );
        $this->assertDatabaseHas('category_genre', [
            'category_id' => $categoriesId[0],
            'genre_id' => $response->json('data.id')
        ]);

        $response = $this->json(
            'PUT',
            route('genres.update', ['genre' => $response->json('data.id')]),
            $this->sendData + [
                'categories' => [$categoriesId[1], $categoriesId[2]]
            ]
        );
        $this->assertDatabaseMissing('category_genre', [
            'category_id' => $categoriesId[0],
            'genre_id' => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('category_genre', [
            'category_id' => $categoriesId[1],
            'genre_id' => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('category_genre', [
            'category_id' => $categoriesId[2],
            'genre_id' => $response->json('data.id')
        ]);
    }

    public function testRollbackStore()
    {
        $controller = \Mockery::mock(GenreController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();
        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn($this->sendData);
        $controller
            ->shouldReceive('rulesStore')
            ->withAnyArgs()
            ->andReturn([]);
        $controller
            ->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $request = \Mockery::mock(Request::class);

        $hasError = false;
        try {
            $controller->store($request);
        } catch (TestException $exception) {
            $this->assertCount(1, Genre::all());
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testRollbackUpdate()
    {
        $controller = \Mockery::mock(GenreController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();
        $controller
            ->shouldReceive('findOrFail')
            ->withAnyArgs()
            ->andReturn($this->genre);
        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn($this->sendData);
        $controller
            ->shouldReceive('rulesStore')
            ->withAnyArgs()
            ->andReturn([]);
        $controller
            ->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $request = \Mockery::mock(Request::class);

        $hasError = false;
        try {
            $controller->update($request, 1);
        } catch (TestException $exception) {
            $genre = Genre::find($this->genre->id);
            $this->assertEquals($this->genre->refresh()->name, $genre->name);
            $hasError = true;
        }

        $this->assertTrue($hasError);
    }

    public function testDestroy()
    {
        $response = $this->json(
            'DELETE',
            route('genres.destroy', ['genre' => $this->genre->id]),
            []
        );

        $response->assertNoContent();
        $this->assertNull(Genre::find($this->genre->id));
        $this->assertNotNull(Genre::withTrashed()->find($this->genre->id));
    }

    public function testInvalidationRequired()
    {
        $data = ['name' => ''];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');
    }

    public function testInvalidationMax()
    {
        $data = ['name' => str_repeat('a', 256)];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);
    }

    public function testInvalidationBoolean()
    {
        $data = ['is_active' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');
    }

    public function testInvalidationCategoriesField()
    {
        $data = ['categories' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = ['categories' => [100]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $category = Category::factory()->create();
        $category->delete();
        $data = ['categories' => [$category->id]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');
    }

    protected function assertHasCategory($genreId, $categoryId)
    {
        $this->assertDatabaseHas('category_genre', [
            'genre_id' => $genreId,
            'category_id' => $categoryId
        ]);
    }

    protected function routeStore()
    {
        return route('genres.store');
    }

    protected function routeUpdate()
    {
        return route('genres.update', ['genre' => $this->genre->id]);
    }

    protected function model()
    {
        return Genre::class;
    }
}
