<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Buku;
use Illuminate\Http\Request;

class BukuController extends Controller
{

    // GET /api/bukus — Ambil semua data buku
    public function index()
    {
        $bukus = Buku::all();
        return response()->json([
            'status' => 'success',
            'data'   => $bukus
        ], 200);
    }

    // POST /api/bukus — Tambah buku baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul'        => 'required|string|max:255',
            'pengarang'    => 'required|string|max:255',
            'penerbit'     => 'required|string|max:255',
            'tahun_terbit' => 'required|integer',
            'isbn'         => 'required|unique:bukus|max:20',
            'stok'         => 'required|integer|min:0',
            'kategori'     => 'required|string',
        ]);
        $buku = Buku::create($validated);
        return response()->json(['status' => 'success', 'data' => $buku], 201);
    }

    // GET /api/bukus/{id} — Ambil satu buku
    public function show(Buku $buku)
    {
        return response()->json(['status' => 'success', 'data' => $buku], 200);
    }

    // PUT /api/bukus/{id} — Update buku
    public function update(Request $request, Buku $buku)
    {
        $buku->update($request->all());
        return response()->json(['status' => 'success', 'data' => $buku], 200);
    }

    // DELETE /api/bukus/{id} — Hapus buku
    public function destroy(Buku $buku)
    {
        $buku->delete();
        return response()->json(['status' => 'success', 'message' => 'Buku dihapus'], 200);
    }
}
