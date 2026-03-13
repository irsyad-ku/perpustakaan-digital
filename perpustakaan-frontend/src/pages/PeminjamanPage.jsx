import { useState, useEffect } from "react";
import api from "../services/api";
import Skeleton from "../components/Skeleton";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import PageTransition from "../components/PageTransition";

export default function PeminjamanPage() {
  const [peminjamans, setPeminjamans] = useState([]);
  const [bukus, setBukus] = useState([]);
  const [anggotas, setAnggotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    buku_id: "",
    anggota_id: "",
    tgl_pinjam: "",
    tgl_kembali_rencana: "",
    tgl_kembali_aktual: "",
    status: "dipinjam",
  });

  const fetchAll = async () => {
    try {
      const [p, b, a] = await Promise.all([
        api.get("/peminjamans"),
        api.get("/bukus"),
        api.get("/anggotas"),
      ]);
      setPeminjamans(p.data.data ?? []);
      setBukus(b.data.data ?? []);
      setAnggotas(a.data.data ?? []);
    } catch (err) {
      console.error("Gagal memuat data peminjaman:", err);
    } finally {
      setLoading(false);
    }
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
    } catch {
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

  const handleDeleteConfirm = async () => {
    try {
      await api.delete("/peminjamans/" + deleteId);
      showNotif("success", "Data peminjaman berhasil dihapus!");
      fetchAll();
    } catch {
      showNotif("error", "Gagal menghapus data peminjaman.");
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = peminjamans.filter((p) => {
    const matchSearch =
      (p.buku?.judul ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.anggota?.nama ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? p.status === filterStatus : true;
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
          message="Yakin ingin menghapus data peminjaman ini? Tindakan ini tidak dapat dibatalkan."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
            🔖 Daftar Peminjaman
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Kelola data peminjaman buku perpustakaan
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-700 dark:text-slate-200 mb-4">
            {editId ? "✏️ Edit Peminjaman" : "➕ Tambah Peminjaman Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Pilih Buku
              </label>
              <select
                value={form.buku_id}
                onChange={(e) => setForm({ ...form, buku_id: e.target.value })}
                className={inputClass}
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
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Pilih Anggota
              </label>
              <select
                value={form.anggota_id}
                onChange={(e) =>
                  setForm({ ...form, anggota_id: e.target.value })
                }
                className={inputClass}
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
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Tanggal Pinjam
              </label>
              <input
                type="date"
                value={form.tgl_pinjam}
                onChange={(e) =>
                  setForm({ ...form, tgl_pinjam: e.target.value })
                }
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Tanggal Kembali Rencana
              </label>
              <input
                type="date"
                value={form.tgl_kembali_rencana}
                onChange={(e) =>
                  setForm({ ...form, tgl_kembali_rencana: e.target.value })
                }
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Tanggal Kembali Aktual
                <span className="text-gray-400 dark:text-slate-500 font-normal ml-1">
                  (isi jika sudah dikembalikan)
                </span>
              </label>
              <input
                type="date"
                value={form.tgl_kembali_aktual}
                onChange={(e) =>
                  setForm({ ...form, tgl_kembali_aktual: e.target.value })
                }
                className={inputClass}
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
            placeholder="🔍 Cari judul buku atau nama anggota..."
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
            <option value="dipinjam">Dipinjam</option>
            <option value="dikembalikan">Dikembalikan</option>
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
            {peminjamans.length}
          </span>{" "}
          peminjaman
        </p>

        {/* Tabel */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-800 dark:bg-blue-900 text-white">
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
              {filtered.length === 0 ? (
                <EmptyState
                  icon={search || filterStatus ? "🔍" : "📭"}
                  title={
                    search || filterStatus
                      ? "Tidak ada hasil"
                      : "Belum ada peminjaman"
                  }
                  desc={
                    search || filterStatus
                      ? "Coba ubah kata kunci atau reset filter."
                      : "Tambahkan peminjaman pertama menggunakan form di atas."
                  }
                />
              ) : (
                filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-gray-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 transition ${
                      i % 2 === 0
                        ? "bg-white dark:bg-slate-800"
                        : "bg-gray-50 dark:bg-slate-700"
                    }`}
                  >
                    <td className="p-3 font-medium text-gray-800 dark:text-slate-100">
                      {p.buku?.judul ?? "-"}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-slate-300">
                      {p.anggota?.nama ?? "-"}
                    </td>
                    <td className="p-3 text-center text-gray-600 dark:text-slate-300">
                      {p.tgl_pinjam}
                    </td>
                    <td className="p-3 text-center text-gray-600 dark:text-slate-300">
                      {p.tgl_kembali_rencana}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          p.status === "dipinjam"
                            ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400"
                            : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
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
                          onClick={() => setDeleteId(p.id)}
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
