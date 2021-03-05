<?php

namespace Database\Factories;

use App\Models\CastMember;
use Illuminate\Database\Eloquent\Factories\Factory;

class CastMemberFactory extends Factory
{
    protected $model = CastMember::class;

    public function definition()
    {
        $type = array_rand(CastMember::TYPES);
        return [
            'name' => $this->faker->colorName,
            'type' => CastMember::TYPES[$type]
        ];
    }
}
