<?php

namespace App\Models;

use App\Models\Traits\Uuid;
use App\Filters\CategoryFilter;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes, Uuid, Filterable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['name', 'description', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    protected $dates = ['deleted_at'];

    public function genres()
    {
        return $this->belongsToMany(Genre::class)->withTrashed();
    }

    public function modelFilter() {
        return $this->provideFilter(CategoryFilter::class);
    }
}
