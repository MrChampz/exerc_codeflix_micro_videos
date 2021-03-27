<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Resources\CastMemberResource;
use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CastMemberControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves, TestResources;

    private $castMember;
    private $serializedFields = [
        'id',
        'name',
        'type',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->castMember = CastMember::factory()->create([
            'type' => CastMember::TYPE_ACTOR
        ]);
    }

    public function testIndex()
    {
        $response = $this->get(route('cast_members.index'));

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

        $resource = CastMemberResource::collection(collect([$this->castMember]));
        $this->assertResource($response, $resource);
    }

    public function testShow()
    {
        $response = $this->get(route(
            'cast_members.show',
            ['cast_member' => $this->castMember->id]
        ));

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => $this->serializedFields
            ]);

        $id = $response->json('data.id');
        $resource = new CastMemberResource(CastMember::find($id));
        $this->assertResource($response, $resource);
    }

    public function testStore()
    {
        $data = [
            [
                'name' => 'test',
                'type' => CastMember::TYPE_ACTOR
            ],
            [
                'name' => 'test',
                'type' => CastMember::TYPE_DIRECTOR
            ]
        ];

        foreach ($data as $key => $value) {
            $response = $this->assertStore($value, $value + [
                'deleted_at' => null
            ]);
            
            $response
                ->assertStatus(201)
                ->assertJsonStructure([
                    'data' => $this->serializedFields
                ]);

            $id = $response->json('data.id');
            $resource = new CastMemberResource(CastMember::find($id));
            $this->assertResource($response, $resource);
        }
    }

    public function testUpdate()
    {
        $data = [
            'name' => 'test',
            'type' => CastMember::TYPE_DIRECTOR
        ];
        $response = $this->assertUpdate($data, $data + [
            'deleted_at' => null
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => $this->serializedFields
            ]);

        $id = $response->json('data.id');
        $resource = new CastMemberResource(CastMember::find($id));
        $this->assertResource($response, $resource);
    }

    public function testDestroy()
    {
        $response = $this->json(
            'DELETE',
            route('cast_members.destroy', ['cast_member' => $this->castMember->id]),
            []
        );

        $response->assertNoContent();
        $this->assertNull(CastMember::find($this->castMember->id));
        $this->assertNotNull(CastMember::withTrashed()->find($this->castMember->id));
    }

    public function testInvalidationData()
    {
        $data = [
            'name' => '',
            'type' => null
        ];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');

        $data = ['name' => str_repeat('a', 256)];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

        $data = ['type' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'in');
        $this->assertInvalidationInUpdateAction($data, 'in');
    }

    protected function routeStore()
    {
        return route('cast_members.store');
    }

    protected function routeUpdate()
    {
        return route('cast_members.update', ['cast_member' => $this->castMember->id]);
    }

    protected function model()
    {
        return CastMember::class;
    }
}
