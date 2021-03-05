<?php

namespace App\Models;

use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMember extends Model
{
    use HasFactory, SoftDeletes, Uuid;

    const TYPE_ACTOR = 1;
    const TYPE_DIRECTOR = 2;

    const TYPES = [
        CastMember::TYPE_ACTOR,
        CastMember::TYPE_DIRECTOR
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['name', 'type'];

    protected $dates = ['deleted_at'];
}
