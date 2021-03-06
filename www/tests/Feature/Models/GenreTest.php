<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Ramsey\Uuid\Validator\GenericValidator;
use Tests\TestCase;

class GenreTest extends TestCase
{
    use DatabaseMigrations;

    private $uuidValidator;
    private $genre;

    public function setUp(): void
    {
        parent::setUp();
        $this->uuidValidator = new GenericValidator();
        $this->genre = Genre::factory()->count(1)->create();
    }

    public function testList()
    {
        $genres = Genre::all();
        $genreKeys = array_keys($genres->first()->getAttributes());

        $this->assertCount(1, $genres);
        $this->assertEqualsCanonicalizing(
            [
                'id',
                'name',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at'
            ],
            $genreKeys
        );
    }

    public function testCreate()
    {
        $genre = Genre::create([
            'name' => 'test1'
        ]);
        $genre->refresh();

        $this->assertTrue($this->uuidValidator->validate($genre->id));

        $this->assertEquals('test1', $genre->name);
        $this->assertNull($genre->description);
        $this->assertTrue($genre->is_active);

        $genre = Genre::create([
            'name' => 'test1',
            'is_active' => false
        ]);
        $this->assertFalse($genre->is_active);

        $genre = Genre::create([
            'name' => 'test1',
            'is_active' => true
        ]);
        $this->assertTrue($genre->is_active);
    }

    public function testUpdate()
    {
        $genre = Genre::factory()->create([
            'is_active' => false
        ]);

        $data = [
            'name' => 'test_name_updated',
            'is_active' => true
        ];
        $genre->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $genre->{ $key });
        }
    }

    public function testDelete()
    {
        $genre = Genre::factory()->create();

        $genre->delete();
        $genre->refresh();

        $this->assertNotNull($genre->deleted_at);

        $genres = Genre::all();
        $this->assertNotContains($genre, $genres);
    }
}
