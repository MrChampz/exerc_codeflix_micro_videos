<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use PHPUnit\Framework\TestCase;

class CategoryTest extends TestCase
{
    use DatabaseMigrations;

    private $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = new Category();
    }

    public function testTraits()
    {
        $traits = [HasFactory::class, SoftDeletes::class, Uuid::class];
        $categoryTraits = array_keys(class_uses(Category::class));
        $this->assertEquals($traits, $categoryTraits);
    }

    public function testIncrementingAttribute()
    {
        $this->assertFalse($this->category->getIncrementing());
    }

    public function testKeyTypeAttribute()
    {
        $this->assertEquals('string', $this->category->getKeyType());
    }

    public function testFillableAttribute()
    {
        $fillable = ['name', 'description', 'is_active'];
        $this->assertEquals($fillable, $this->category->getFillable());
    }

    public function testCastsAttribute()
    {
        $casts = ['is_active' => 'boolean', 'deleted_at' => 'datetime'];
        $this->assertEquals($casts, $this->category->getCasts());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $this->assertEqualsCanonicalizing($dates, $this->category->getDates());
        $this->assertCount(count($dates), $this->category->getDates());
    }
}
