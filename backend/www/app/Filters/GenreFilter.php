<?php 

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class GenreFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'is_active', 'created_at'];
    
    public function search($search) {
        $this->query->where('name', 'LIKE', "%$search%");
    }

    public function categories($categories) {
      $idOrNames = explode(",", $categories);
      $this->whereHas('categories', function (Builder $query) use ($idOrNames) {
        $query
          ->whereIn('id', $idOrNames)
          ->orWhereIn('name', $idOrNames);
      });
    }
}
