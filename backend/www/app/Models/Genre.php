<?php

namespace App\Models;

use App\Models\Traits\Uuid;
use App\Filters\GenreFilter;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Genre extends Model
{
    use HasFactory, SoftDeletes, Uuid, Filterable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['name', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    protected $dates = ['deleted_at'];

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function modelFilter() {
        return $this->provideFilter(GenreFilter::class);
    }
}
