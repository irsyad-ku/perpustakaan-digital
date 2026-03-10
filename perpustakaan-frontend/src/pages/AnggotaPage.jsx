import { useState, useEffect } from "react";
import api from "../services/api";

export default function AnggotaPage() {
  const [anggotas, setAnggotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_hp: "",
    alamat: "",
    tgl_daftar: "",
    status: "aktif",
  });

  const fetchAnggotas = async () => {
    const res = await api.get("/anggotas");
    setAnggotas(res.data.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnggotas();
  }, []);

  const showNotif = (type, msg) => {
    setNotif({ type, msg });
    setTimeout(() => setNotif(null), 3000);
  };

  const resetForm = () => {
    setForm({
      nama: "",
      email: "",
      no_hp: "",
      alamat: "",
      tgl_daftar: "",
      status: "aktif",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put("/anggotas/" + editId, form);
        showNotif("success", "Anggota berhasil diperbarui!");
      } else {
        await api.post("/anggotas", form);
        showNotif("success", "Anggota berhasil ditambahkan!");
      }
      resetForm();
      fetchAnggotas();
    } catch (err) {
      showNotif("error", "Gagal menyimpan data. Periksa kembali inputan.");
    }
  };

  const handleEdit = (anggota) => {
    setEditId(anggota.id);
    setForm({
      nama: anggota.nama,
      email: anggota.email,
      no_hp: anggota.no_hp,
      alamat: anggota.alamat,
      tgl_daftar: anggota.tgl_daftar,
      status: anggota.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus anggota ini?")) return;
    try {
      await api.delete("/anggotas/" + id);
      showNotif("success", "Anggota berhasil dihapus!");
      fetchAnggotas();
    } catch (err) {
      showNotif("error", "Gagal menghapus anggota.");
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
        <h1 className="text-3xl font-bold text-gray-800">👥 Daftar Anggota</h1>
        <p className="text-gray-500 mt-1">Kelola data anggota perpustakaan</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          {editId ? "✏️ Edit Anggota" : "➕ Tambah Anggota Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Nama Lengkap
            </label>
            <input
              placeholder="Masukkan nama lengkap"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              No. HP
            </label>
            <input
              placeholder="Contoh: 08123456789"
              value={form.no_hp}
              onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Tanggal Daftar
            </label>
            <input
              type="date"
              value={form.tgl_daftar}
              onChange={(e) => setForm({ ...form, tgl_daftar: e.target.value })}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Alamat
            </label>
            <textarea
              placeholder="Masukkan alamat lengkap"
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              rows={2}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
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
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Non Aktif</option>
            </select>
          </div>
          <div className="flex items-end gap-3">
            <button
              type="submit"
              className={`flex-1 text-white py-2 rounded-lg font-semibold transition ${
                editId
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editId ? "💾 Simpan Perubahan" : "➕ Tambah Anggota"}
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
              {anggotas.length} anggota
            </span>
          </p>
        </div>
        <table className="w-full">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">No. HP</th>
              <th className="p-3 text-center">Tgl Daftar</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {anggotas.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-400">
                  Belum ada data anggota.
                </td>
              </tr>
            ) : (
              anggotas.map((anggota, i) => (
                <tr
                  key={anggota.id}
                  className={`border-b border-gray-100 hover:bg-blue-50 transition ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 font-medium text-gray-800">
                    {anggota.nama}
                  </td>
                  <td className="p-3 text-gray-600">{anggota.email}</td>
                  <td className="p-3 text-gray-600">{anggota.no_hp}</td>
                  <td className="p-3 text-center text-gray-600">
                    {anggota.tgl_daftar}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        anggota.status === "aktif"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {anggota.status === "aktif" ? "🟢 Aktif" : "🔴 Non Aktif"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(anggota)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(anggota.id)}
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
