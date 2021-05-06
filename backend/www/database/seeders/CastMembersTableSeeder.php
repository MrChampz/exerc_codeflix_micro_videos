<?php

namespace Database\Seeders;

use App\Models\CastMember;
use Illuminate\Database\Seeder;

class CastMembersTableSeeder extends Seeder
{
    public function run()
    {
        CastMember::factory()->count(100)->create();
    }
}
