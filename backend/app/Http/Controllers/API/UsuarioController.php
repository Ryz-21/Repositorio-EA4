<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index()
    {
        return response()->json(Usuario::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apePaterno' => 'required|string|max:255',
            'apeMaterno' => 'required|string|max:255',
            'user' => 'required|string|max:255|unique:usuarios,user',
            'password' => 'required|string|min:4',
            'estado' => 'sometimes|in:activo,inactivo',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $usuario = Usuario::create($validated);

        return response()->json($usuario, 201);
    }

    public function show($id)
    {
        $usuario = Usuario::findOrFail($id);
        return response()->json($usuario);
    }

    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'apePaterno' => 'sometimes|string|max:255',
            'apeMaterno' => 'sometimes|string|max:255',
            'user' => 'sometimes|string|max:255|unique:usuarios,user,' . $id,
            'password' => 'sometimes|string|min:4',
            'estado' => 'sometimes|in:activo,inactivo',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $usuario->update($validated);

        return response()->json($usuario);
    }

    public function destroy($id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->delete();

        return response()->json(null, 204);
    }
}
