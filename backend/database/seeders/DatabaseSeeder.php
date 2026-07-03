<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::create([
            'nombre' => 'Carlos',
            'apePaterno' => 'García',
            'apeMaterno' => 'López',
            'user' => 'cgarcia',
            'password' => bcrypt('1234'),
            'estado' => 'activo',
        ]);

        Usuario::create([
            'nombre' => 'María',
            'apePaterno' => 'Torres',
            'apeMaterno' => 'Vega',
            'user' => 'mtorres',
            'password' => bcrypt('1234'),
            'estado' => 'activo',
        ]);

        Usuario::create([
            'nombre' => 'Luis',
            'apePaterno' => 'Quispe',
            'apeMaterno' => 'Ramos',
            'user' => 'lquispe',
            'password' => bcrypt('1234'),
            'estado' => 'inactivo',
        ]);
    }
}
