<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Anggota;
use Illuminate\Http\Request;

class AnggotaController extends Controller
{
    public function index()
    {
        $anggotas = Anggota::all();
        return response()->json([
            'status' => 'success',
            'data'   => $anggotas
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama'       => 'required|string|max:255',
            'email'      => 'required|email|unique:anggotas',
            'no_hp'      => 'required|string|max:15',
            'alamat'     => 'required|string',
            'tgl_daftar' => 'required|date',
            'status'     => 'in:aktif,nonaktif',
        ]);
        $anggota = Anggota::create($validated);
        return response()->json(['status' => 'success', 'data' => $anggota], 201);
    }

    public function show(Anggota $anggota)
    {
        return response()->json(['status' => 'success', 'data' => $anggota], 200);
    }

    public function update(Request $request, Anggota $anggota)
    {
        $anggota->update($request->all());
        return response()->json(['status' => 'success', 'data' => $anggota], 200);
    }

    public function destroy(Anggota $anggota)
    {
        $anggota->delete();
        return response()->json(['status' => 'success', 'message' => 'Anggota dihapus'], 200);
    }
}
