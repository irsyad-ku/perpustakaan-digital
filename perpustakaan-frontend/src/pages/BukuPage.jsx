import { useState, useEffect } from "react";
import api from "../services/api";

export default function BukuPage() {
  const [bukus, setBukus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null); // { type: 'success'|'error', msg }
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    judul: "",
    pengarang: "",
    penerbit: "",
    tahun_terbit: "",
    isbn: "",
    stok: 1,
    kategori: "",
  });

  const fetchBukus = async () => {
    const res = await api.get("/bukus");
    setBukus(res.data.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBukus();
  }, []);

  const showNotif = (type, msg) => {
    setNotif({ type, msg });
    setTimeout(() => setNotif(null), 3000);
  };

  const resetForm = () => {
    setForm({
      judul: "",
      pengarang: "",
      penerbit: "",
      tahun_terbit: "",
      isbn: "",
      stok: 1,
      kategori: "",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put("/bukus/" + editId, form);
        showNotif("success", "Buku berhasil diperbarui!");
      } else {
        await api.post("/bukus", form);
        showNotif("success", "Buku berhasil ditambahkan!");
      }
      resetForm();
      fetchBukus();
    } catch (err) {
      showNotif("error", "Gagal menyimpan data. Periksa kembali inputan.");
    }
  };

  const handleEdit = (buku) => {
    setEditId(buku.id);
    setForm({
      judul: buku.judul,
      pengarang: buku.pengarang,
      penerbit: buku.penerbit,
      tahun_terbit: buku.tahun_terbit,
      isbn: buku.isbn,
      stok: buku.stok,
      kategori: buku.kategori,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;
    try {
      await api.delete("/bukus/" + id);
      showNotif("success", "Buku berhasil dihapus!");
      fetchBukus();
    } catch (err) {
      showNotif("error", "Gagal menghapus buku.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-blue-600 text-lg font-medium">Memuat data...</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Notifikasi */}
      {notif && (
        <div
          className={`fixed top-20 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
            notif.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notif.type === "success" ? "✅" : "❌"} {notif.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📚 Daftar Buku</h1>
        <p className="text-gray-500 mt-1">Kelola koleksi buku perpustakaan</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          {editId ? "✏️ Edit Buku" : "➕ Tambah Buku Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Judul Buku
            </label>
            <input
              placeholder="Masukkan judul buku"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Pengarang
            </label>
            <input
              placeholder="Nama pengarang"
              value={form.pengarang}
              onChange={(e) => setForm({ ...form, pengarang: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Penerbit
            </label>
            <input
              placeholder="Nama penerbit"
              value={form.penerbit}
              onChange={(e) => setForm({ ...form, penerbit: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Tahun Terbit
            </label>
            <input
              placeholder="Contoh: 2023"
              value={form.tahun_terbit}
              onChange={(e) =>
                setForm({ ...form, tahun_terbit: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              ISBN
            </label>
            <input
              placeholder="Nomor ISBN"
              value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Stok
            </label>
            <input
              type="number"
              min="0"
              placeholder="Jumlah stok"
              value={form.stok}
              onChange={(e) => setForm({ ...form, stok: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Kategori
            </label>
            <input
              placeholder="Contoh: Teknologi, Fiksi, Sains"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="col-span-2 flex gap-3">
            <button
              type="submit"
              className={`flex-1 text-white py-2 rounded-lg font-semibold transition ${
                editId
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editId ? "💾 Simpan Perubahan" : "➕ Tambah Buku"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <p className="text-gray-500 text-sm">
            Total:{" "}
            <span className="font-bold text-gray-700">{bukus.length} buku</span>
          </p>
        </div>
        <table className="w-full">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="p-3 text-left">Judul</th>
              <th className="p-3 text-left">Pengarang</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-center">ISBN</th>
              <th className="p-3 text-center">Stok</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bukus.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-400">
                  Belum ada data buku.
                </td>
              </tr>
            ) : (
              bukus.map((buku, i) => (
                <tr
                  key={buku.id}
                  className={`border-b border-gray-100 hover:bg-blue-50 transition ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 font-medium text-gray-800">
                    {buku.judul}
                  </td>
                  <td className="p-3 text-gray-600">{buku.pengarang}</td>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                      {buku.kategori}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-sm text-gray-500">
                    {buku.isbn}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`font-bold text-sm ${buku.stok > 0 ? "text-green-600" : "text-red-500"}`}
                    >
                      {buku.stok}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(buku)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(buku.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
