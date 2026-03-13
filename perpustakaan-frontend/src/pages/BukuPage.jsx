import { useState, useEffect } from "react";
import api from "../services/api";
import Skeleton from "../components/Skeleton";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import PageTransition from "../components/PageTransition";

export default function BukuPage() {
  const [bukus, setBukus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [deleteId, setDeleteId] = useState(null);
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
    try {
      const res = await api.get("/bukus");
      setBukus(res.data.data ?? []);
    } catch (err) {
      console.error("Gagal memuat buku:", err);
    } finally {
      setLoading(false);
    }
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
    } catch {
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

  const handleDeleteConfirm = async () => {
    try {
      await api.delete("/bukus/" + deleteId);
      showNotif("success", "Buku berhasil dihapus!");
      fetchBukus();
    } catch {
      showNotif("error", "Gagal menghapus buku.");
    } finally {
      setDeleteId(null);
    }
  };

  const kategoriList = [...new Set(bukus.map((b) => b.kategori))];
  const filtered = bukus.filter((b) => {
    const matchSearch =
      b.judul.toLowerCase().includes(search.toLowerCase()) ||
      b.pengarang.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase());
    const matchKategori = filterKategori ? b.kategori === filterKategori : true;
    return matchSearch && matchKategori;
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
          message="Yakin ingin menghapus buku ini? Tindakan ini tidak dapat dibatalkan."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">
            📚 Daftar Buku
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Kelola koleksi buku perpustakaan
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-700 dark:text-slate-200 mb-4">
            {editId ? "✏️ Edit Buku" : "➕ Tambah Buku Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Judul Buku",
                key: "judul",
                placeholder: "Masukkan judul buku",
              },
              {
                label: "Pengarang",
                key: "pengarang",
                placeholder: "Nama pengarang",
              },
              {
                label: "Penerbit",
                key: "penerbit",
                placeholder: "Nama penerbit",
              },
              {
                label: "Tahun Terbit",
                key: "tahun_terbit",
                placeholder: "Contoh: 2023",
              },
              { label: "ISBN", key: "isbn", placeholder: "Nomor ISBN" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                  {label}
                </label>
                <input
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
            ))}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Stok
              </label>
              <input
                type="number"
                min="0"
                placeholder="Jumlah stok"
                value={form.stok}
                onChange={(e) => setForm({ ...form, stok: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
                Kategori
              </label>
              <input
                placeholder="Contoh: Teknologi, Fiksi, Sains"
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                className={inputClass}
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
            placeholder="🔍 Cari judul, pengarang, atau ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 ${inputClass}`}
          />
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className={inputClass}
          >
            <option value="">Semua Kategori</option>
            {kategoriList.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          {(search || filterKategori) && (
            <button
              onClick={() => {
                setSearch("");
                setFilterKategori("");
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
            {bukus.length}
          </span>{" "}
          buku
        </p>

        {/* Tabel */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-800 dark:bg-blue-900 text-white">
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
              {filtered.length === 0 ? (
                <EmptyState
                  icon={search || filterKategori ? "🔍" : "📭"}
                  title={
                    search || filterKategori
                      ? "Tidak ada hasil"
                      : "Belum ada buku"
                  }
                  desc={
                    search || filterKategori
                      ? "Coba ubah kata kunci atau reset filter."
                      : "Tambahkan buku pertama menggunakan form di atas."
                  }
                />
              ) : (
                filtered.map((buku, i) => (
                  <tr
                    key={buku.id}
                    className={`border-b border-gray-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 transition ${
                      i % 2 === 0
                        ? "bg-white dark:bg-slate-800"
                        : "bg-gray-50 dark:bg-slate-700"
                    }`}
                  >
                    <td className="p-3 font-medium text-gray-800 dark:text-slate-100">
                      {buku.judul}
                    </td>
                    <td className="p-3 text-gray-600 dark:text-slate-300">
                      {buku.pengarang}
                    </td>
                    <td className="p-3">
                      <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full">
                        {buku.kategori}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono text-sm text-gray-500 dark:text-slate-400">
                      {buku.isbn}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`font-bold text-sm ${buku.stok > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
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
                          onClick={() => setDeleteId(buku.id)}
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
