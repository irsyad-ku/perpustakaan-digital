import { useState, useEffect } from "react";
import api from "../services/api";

export default function PeminjamanPage() {
  const [peminjamans, setPeminjamans] = useState([]);
  const [bukus, setBukus] = useState([]);
  const [anggotas, setAnggotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    buku_id: "",
    anggota_id: "",
    tgl_pinjam: "",
    tgl_kembali_rencana: "",
    tgl_kembali_aktual: "",
    status: "dipinjam",
  });

  const fetchAll = async () => {
    const [p, b, a] = await Promise.all([
      api.get("/peminjamans"),
      api.get("/bukus"),
      api.get("/anggotas"),
    ]);
    setPeminjamans(p.data.data ?? []);
    setBukus(b.data.data ?? []);
    setAnggotas(a.data.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const showNotif = (type, msg) => {
    setNotif({ type, msg });
    setTimeout(() => setNotif(null), 3000);
  };

  const resetForm = () => {
    setForm({
      buku_id: "",
      anggota_id: "",
      tgl_pinjam: "",
      tgl_kembali_rencana: "",
      tgl_kembali_aktual: "",
      status: "dipinjam",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put("/peminjamans/" + editId, form);
        showNotif("success", "Data peminjaman berhasil diperbarui!");
      } else {
        await api.post("/peminjamans", form);
        showNotif("success", "Peminjaman berhasil ditambahkan!");
      }
      resetForm();
      fetchAll();
    } catch (err) {
      showNotif("error", "Gagal menyimpan data. Periksa kembali inputan.");
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({
      buku_id: p.buku_id,
      anggota_id: p.anggota_id,
      tgl_pinjam: p.tgl_pinjam,
      tgl_kembali_rencana: p.tgl_kembali_rencana,
      tgl_kembali_aktual: p.tgl_kembali_aktual ?? "",
      status: p.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data peminjaman ini?")) return;
    try {
      await api.delete("/peminjamans/" + id);
      showNotif("success", "Data peminjaman berhasil dihapus!");
      fetchAll();
    } catch (err) {
      showNotif("error", "Gagal menghapus data peminjaman.");
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
        <h1 className="text-3xl font-bold text-gray-800">
          🔖 Daftar Peminjaman
        </h1>
        <p className="text-gray-500 mt-1">
          Kelola data peminjaman buku perpustakaan
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          {editId ? "✏️ Edit Peminjaman" : "➕ Tambah Peminjaman Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Pilih Buku
            </label>
            <select
              value={form.buku_id}
              onChange={(e) => setForm({ ...form, buku_id: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">-- Pilih Buku --</option>
              {bukus.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.judul}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Pilih Anggota
            </label>
            <select
              value={form.anggota_id}
              onChange={(e) => setForm({ ...form, anggota_id: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">-- Pilih Anggota --</option>
              {anggotas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Tanggal Pinjam
            </label>
            <input
              type="date"
              value={form.tgl_pinjam}
              onChange={(e) => setForm({ ...form, tgl_pinjam: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Tanggal Kembali Rencana
            </label>
            <input
              type="date"
              value={form.tgl_kembali_rencana}
              onChange={(e) =>
                setForm({ ...form, tgl_kembali_rencana: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Tanggal Kembali Aktual
              <span className="text-gray-400 font-normal ml-1">
                (isi jika sudah dikembalikan)
              </span>
            </label>
            <input
              type="date"
              value={form.tgl_kembali_aktual}
              onChange={(e) =>
                setForm({ ...form, tgl_kembali_aktual: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="dipinjam">Dipinjam</option>
              <option value="dikembalikan">Dikembalikan</option>
            </select>
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
              {editId ? "💾 Simpan Perubahan" : "➕ Tambah Peminjaman"}
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
            <span className="font-bold text-gray-700">
              {peminjamans.length} peminjaman
            </span>
          </p>
        </div>
        <table className="w-full">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="p-3 text-left">Buku</th>
              <th className="p-3 text-left">Anggota</th>
              <th className="p-3 text-center">Tgl Pinjam</th>
              <th className="p-3 text-center">Tgl Kembali</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {peminjamans.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-400">
                  Belum ada data peminjaman.
                </td>
              </tr>
            ) : (
              peminjamans.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-gray-100 hover:bg-blue-50 transition ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 font-medium text-gray-800">
                    {p.buku?.judul ?? "-"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {p.anggota?.nama ?? "-"}
                  </td>
                  <td className="p-3 text-center text-gray-600">
                    {p.tgl_pinjam}
                  </td>
                  <td className="p-3 text-center text-gray-600">
                    {p.tgl_kembali_rencana}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.status === "dipinjam"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.status === "dipinjam"
                        ? "📖 Dipinjam"
                        : "✅ Dikembalikan"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
