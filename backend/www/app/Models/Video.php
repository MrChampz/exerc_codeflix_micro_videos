<?php

namespace App\Models;

use App\Models\Traits\UploadFiles;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use HasFactory, SoftDeletes, Uuid, UploadFiles;

    const RATING_LIST = ['L', '10', '12', '14', '16', '18'];

    const THUMB_FILE_MAX_SIZE = 1024 * 5; // 5MB
    const BANNER_FILE_MAX_SIZE = 1024 * 10; // 10MB
    const TRAILER_FILE_MAX_SIZE = 1024 * 1024 * 1; // 1GB
    const VIDEO_FILE_MAX_SIZE = 1024 * 1024 * 50; // 50GB

    public static $fileFields = [
        'video_file',
        'thumb_file',
        'banner_file',
        'trailer_file'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'year_launched',
        'opened',
        'rating',
        'duration',
        'video_file',
        'thumb_file',
        'banner_file',
        'trailer_file'
    ];

    protected $casts = [
        'opened' => 'boolean',
        'year_launched' => 'integer',
        'duration' => 'integer'
    ];

    protected $dates = ['deleted_at'];

    public static function create(array $attributes = [])
    {
        $files = self::extractFiles($attributes);
        try {
            \DB::beginTransaction();
            $video = static::query()->create($attributes);
            static::handleRelations($video, $attributes);
            $video->uploadFiles($files);
            \DB::commit();
            return $video;
        } catch (\Exception $e) {
            if (isset($video)) {
                $video->deleteFiles($files);
            }
            \DB::rollBack();
            throw $e;
        }
    }

    public function update(array $attributes = [], array $options = [])
    {
        $files = self::extractFiles($attributes);
        try {
            \DB::beginTransaction();
            $saved = parent::update($attributes, $options);
            static::handleRelations($this, $attributes);
            if ($saved) {
                $this->uploadFiles($files);
            }
            \DB::commit();
            if ($saved && count($files)) {
                $this->deleteOldFiles();
            }
            return $saved;
        } catch (\Exception $e) {
            $this->deleteFiles($files);
            \DB::rollBack();
            throw $e;
        }
    }

    public static function handleRelations(Video $video, array $attributes)
    {
        if (isset($attributes['categories'])) {
            $video->categories()->sync($attributes['categories']);
        }
        if (isset($attributes['genres'])) {
            $video->genres()->sync($attributes['genres']);
        }
        if (isset($attributes['cast_members'])) {
            $video->castMembers()->sync($attributes['cast_members']);
        }
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class)->withTrashed();
    }

    public function castMembers()
    {
        return $this->belongsToMany(CastMember::class)->withTrashed();
    }

    public function getVideoFileUrlAttribute()
    {
        return $this->getFileUrl($this->video_file);
    }

    public function getTrailerFileUrlAttribute()
    {
        return $this->getFileUrl($this->trailer_file);
    }

    public function getThumbFileUrlAttribute()
    {
        return $this->getFileUrl($this->thumb_file);
    }

    public function getBannerFileUrlAttribute()
    {
        return $this->getFileUrl($this->banner_file);
    }

    protected function uploadDir()
    {
        return $this->id;
    }
}
