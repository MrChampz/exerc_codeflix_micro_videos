<?php

namespace App\Models;

use App\Models\Traits\Uuid;
use App\Filters\CastMemberFilter;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMember extends Model
{
    use HasFactory, SoftDeletes, Uuid, Filterable;

    const TYPE_ACTOR = 1;
    const TYPE_DIRECTOR = 2;

    const TYPE_LIST = [
        CastMember::TYPE_ACTOR,
        CastMember::TYPE_DIRECTOR
    ];
    
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['name', 'type'];

    protected $dates = ['deleted_at'];

    public function modelFilter() {
        return $this->provideFilter(CastMemberFilter::class);
    }
}
