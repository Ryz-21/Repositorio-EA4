<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';

    protected $fillable = [
        'nombre',
        'apePaterno',
        'apeMaterno',
        'user',
        'password',
        'estado',
    ];

    protected $hidden = [
        'password',
    ];
}
