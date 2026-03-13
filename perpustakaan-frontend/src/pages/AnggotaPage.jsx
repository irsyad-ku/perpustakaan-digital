import { useState, useEffect } from "react";
import api from "../services/api";
import Skeleton from "../components/Skeleton";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import PageTransition from "../components/PageTransition";

export default function AnggotaPage() {
  const [anggotas, setAnggotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_hp: "",
    alamat: "",
    tgl_daftar: "",
    status: "aktif",
  });

  const fetchAnggotas = async () => {
    try {
      const res = await api.get("/anggotas");
      setAnggotas(res.data.data ?? []);
    } catch (err) {
      console.error("Gagal memuat anggota:", err);
    } finally {
      setLoading(false);
    }
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
    } catch {
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

  const handleDeleteConfirm = async () => {
    try {
      await api.delete("/anggotas/" + deleteId);
      showNotif("success", "Anggota berhasil dihapus!");
      fetchAnggotas();
    } catch {
      showNotif("error", "Gagal menghapus anggota.");
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = anggotas.filter((a) => {
    const matchSearch =
      a.nama.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.no_hp.includes(search);
    const matchStatus = filterStatus ? a.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const inputClass =
    "border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition";

  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Skeleton rows={5} />
      </div>
    );

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-6">
        {/* Notifikasi */}
        {notif && (
          <div
            className={`fixed top-20 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in ${
              notif.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notif.type === "success" ? "✅" : "❌"} {notif.msg}
          </div>
        )}

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={!!deleteId}
          message="Yakin ingin menghapus anggota ini? Tindakan ini tidak dapat dibatalkan."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
            👥 Daftar Anggota
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Kelola data anggota perpustakaan
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-700 dark:text-slate-200 mb-4">
            {editId ? "✏️ Edit Anggota" : "➕ Tambah Anggota Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Nama Lengkap
              </label>
              <input
                placeholder="Masukkan nama lengkap"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                No. HP
              </label>
              <input
                placeholder="Contoh: 08123456789"
                value={form.no_hp}
                onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Tanggal Daftar
              </label>
              <input
                type="date"
                value={form.tgl_daftar}
                onChange={(e) =>
                  setForm({ ...form, tgl_daftar: e.target.value })
                }
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Alamat
              </label>
              <textarea
                placeholder="Masukkan alamat lengkap"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                rows={2}
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
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
                  className="px-6 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            placeholder="🔍 Cari nama, email, atau no HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={inputClass}
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Non Aktif</option>
          </select>
          {(search || filterStatus) && (
            <button
              onClick={() => {
                setSearch("");
                setFilterStatus("");
              }}
              className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 px-3 py-2 rounded-lg text-sm transition"
            >
              Reset
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
          Menampilkan{" "}
          <span className="font-bold text-gray-700 dark:text-slate-200">
            {filtered.length}
          </span>{" "}
          dari{" "}
          <span className="font-bold text-gray-700 dark:text-slate-200">
            {anggotas.length}
          </span>{" "}
          anggota
        </p>

        {/* Tabel */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-800 dark:bg-blue-900 text-white">
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
              {filtered.length === 0 ? (
                <EmptyState
                  icon={search || filterStatus ? "🔍" : "📭"}
                  title={
                    search || filterStatus
                      ? "Tidak ada hasil"
                      : "Belum ada anggota"
                  }
                  desc={
                    search || filterStatus
                      ? "Coba ubah kata kunci atau reset filter."
                      : "Tambahkan anggota pertama menggunakan form di atas."
                  }
                />
              ) : (
                filtered.map((anggota, i) => (
                  <tr
                    key={anggota.id}
                    className={`border-b border-gray-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 transition ${
                      i % 2 === 0
                        ? "bg-white dark:bg-slate-800"
                        : "bg-gray-50 dark:bg-slate-700"
                    }`}
                  >
                    <td className="p-3 font-medium text-gray-800 dark:text-slate-100">
                      {anggota.nama}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-slate-300">
                      {anggota.email}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-slate-300">
                      {anggota.no_hp}
                    </td>
                    <td className="p-3 text-center text-gray-600 dark:text-slate-300">
                      {anggota.tgl_daftar}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          anggota.status === "aktif"
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {anggota.status === "aktif"
                          ? "🟢 Aktif"
                          : "🔴 Non Aktif"}
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
                          onClick={() => setDeleteId(anggota.id)}
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
    </PageTransition>
  );
}
