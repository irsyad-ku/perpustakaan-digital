<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Peminjaman;
use Illuminate\Http\Request;

class PeminjamanController extends Controller
{
    public function index()
    {
        $peminjamans = Peminjaman::with(['buku', 'anggota'])->get();
        return response()->json([
            'status' => 'success',
            'data'   => $peminjamans
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'buku_id'              => 'required|exists:bukus,id',
            'anggota_id'           => 'required|exists:anggotas,id',
            'tgl_pinjam'           => 'required|date',
            'tgl_kembali_rencana'  => 'required|date',
            'status'               => 'in:dipinjam,dikembalikan',
        ]);
        $peminjaman = Peminjaman::create($validated);
        return response()->json(['status' => 'success', 'data' => $peminjaman], 201);
    }

    public function show(Peminjaman $peminjaman)
    {
        return response()->json(['status' => 'success', 'data' => $peminjaman->load(['buku', 'anggota'])], 200);
    }

    public function update(Request $request, Peminjaman $peminjaman)
    {
        $peminjaman->update($request->all());
        return response()->json(['status' => 'success', 'data' => $peminjaman], 200);
    }

    public function destroy(Peminjaman $peminjaman)
    {
        $peminjaman->delete();
        return response()->json(['status' => 'success', 'message' => 'Peminjaman dihapus'], 200);
    }
}
