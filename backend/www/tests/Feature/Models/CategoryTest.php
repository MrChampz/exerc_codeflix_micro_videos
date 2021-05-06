<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Ramsey\Uuid\Validator\GenericValidator;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use DatabaseMigrations;

    private $uuidValidator;
    private $category;

    public function setUp(): void
    {
        parent::setUp();
        $this->uuidValidator = new GenericValidator();
        $this->category = Category::factory()->create([
            'description' => 'test_description',
            'is_active' => false
        ]);
    }

    public function testList()
    {
        $categories = Category::all();
        $categoryKeys = array_keys($categories->first()->getAttributes());

        $this->assertCount(1, $categories);
        $this->assertEqualsCanonicalizing(
            [
                'id',
                'name',
                'description',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at'
            ],
            $categoryKeys
        );
    }

    public function testCreate()
    {
        $category = Category::create([
            'name' => 'test1'
        ]);
        $category->refresh();

        $this->assertTrue($this->uuidValidator->validate($category->id));
        $this->assertEquals('test1', $category->name);
        $this->assertNull($category->description);
        $this->assertTrue($category->is_active);

        $category = Category::create([
            'name' => 'test1',
            'description' => null
        ]);
        $this->assertNull($category->description);

        $category = Category::create([
            'name' => 'test1',
            'description' => 'test description'
        ]);
        $this->assertEquals('test description', $category->description);

        $category = Category::create([
            'name' => 'test1',
            'is_active' => false
        ]);
        $this->assertFalse($category->is_active);

        $category = Category::create([
            'name' => 'test1',
            'is_active' => true
        ]);
        $this->assertTrue($category->is_active);
    }

    public function testUpdate()
    {
        $data = [
            'name' => 'test_name_updated',
            'description' => 'test_description_updated',
            'is_active' => true
        ];
        $this->category->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $this->category->{$key});
        }
    }

    public function testDelete()
    {
        $this->category->delete();
        $this->category->refresh();

        $this->assertNotNull($this->category->deleted_at);
        $this->assertNull(Category::find($this->category->id));
    }

    public function testRestore()
    {
        $this->category = Category::factory()->create();

        $this->category->delete();
        $this->category->refresh();

        $this->assertNotNull($this->category->deleted_at);
        $this->assertNull(Category::find($this->category->id));

        $this->category->restore();

        $this->assertNotNull(Category::find($this->category->id));
    }
}
