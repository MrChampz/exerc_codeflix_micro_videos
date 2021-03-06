<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;

    private $castMember;

    protected function setUp(): void
    {
        parent::setUp();
        $this->castMember = new CastMember();
    }

    public function testTraits()
    {
        $traits = [HasFactory::class, SoftDeletes::class, Uuid::class];
        $castMemberTraits = array_keys(class_uses(CastMember::class));
        $this->assertEquals($traits, $castMemberTraits);
    }

    public function testIncrementingAttribute()
    {
        $this->assertFalse($this->castMember->getIncrementing());
    }

    public function testKeyTypeAttribute()
    {
        $this->assertEquals('string', $this->castMember->getKeyType());
    }

    public function testFillableAttribute()
    {
        $fillable = ['name', 'type'];
        $this->assertEquals($fillable, $this->castMember->getFillable());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $this->assertEqualsCanonicalizing($dates, $this->castMember->getDates());
        $this->assertCount(count($dates), $this->castMember->getDates());
    }
}
