<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Ramsey\Uuid\Validator\GenericValidator;
use Tests\TestCase;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;

    private $uuidValidator;
    private $castMember;

    public function setUp(): void
    {
        parent::setUp();
        $this->uuidValidator = new GenericValidator();
        $this->castMember = CastMember::factory()->create([
            'type' => CastMember::TYPE_ACTOR
        ]);
    }

    public function testList()
    {
        $castMembers = CastMember::all();
        $castMemberKeys = array_keys($castMembers->first()->getAttributes());

        $this->assertCount(1, $castMembers);
        $this->assertEqualsCanonicalizing(
            [
                'id',
                'name',
                'type',
                'created_at',
                'updated_at',
                'deleted_at'
            ],
            $castMemberKeys
        );
    }

    public function testCreate()
    {
        $castMember = CastMember::create([
            'name' => 'test1',
            'type' => CastMember::TYPE_ACTOR
        ]);
        $castMember->refresh();

        $this->assertTrue($this->uuidValidator->validate($castMember->id));
        $this->assertEquals('test1', $castMember->name);
        $this->assertEquals(CastMember::TYPE_ACTOR, $castMember->type);
    }

    public function testUpdate()
    {
        $data = [
            'name' => 'test_name_updated',
            'type' => CastMember::TYPE_DIRECTOR
        ];
        $this->castMember->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $this->castMember->{$key});
        }
    }

    public function testDelete()
    {
        $this->castMember->delete();
        $this->castMember->refresh();

        $this->assertNotNull($this->castMember->deleted_at);
        $this->assertNull(CastMember::find($this->castMember->id));
    }

    public function testRestore()
    {
        $this->castMember->delete();
        $this->castMember->refresh();

        $this->assertNotNull($this->castMember->deleted_at);
        $this->assertNull(CastMember::find($this->castMember->id));

        $this->castMember->restore();

        $this->assertNotNull(CastMember::find($this->castMember->id));
    }
}
