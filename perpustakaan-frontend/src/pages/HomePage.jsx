import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function HomePage() {
  const [stats, setStats] = useState({ buku: 0, anggota: 0, peminjaman: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [b, a, p] = await Promise.all([
        api.get("/bukus"),
        api.get("/anggotas"),
        api.get("/peminjamans"),
      ]);
      setStats({
        buku: b.data.data?.length ?? 0,
        anggota: a.data.data?.length ?? 0,
        peminjaman: p.data.data?.length ?? 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Perpustakaan Digital</h1>
        <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
          Temukan, pinjam, dan kelola koleksi buku dengan mudah. Sistem
          perpustakaan modern berbasis web.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/buku"
            className="bg-white text-blue-800 font-bold px-8 py-3 rounded-lg hover:bg-blue-100 transition"
          >
            Lihat Koleksi Buku
          </Link>
          <Link
            to="/peminjaman"
            className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white hover:text-blue-800 transition"
          >
            Peminjaman
          </Link>
        </div>
      </div>

      {/* Statistik */}
      <div className="bg-gray-50 py-12 px-6">
        <h2 className="text-center text-2xl font-bold text-gray-700 mb-8">
          Statistik Perpustakaan
        </h2>
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow p-6 text-center border-t-4 border-blue-500">
            <p className="text-5xl font-bold text-blue-600">{stats.buku}</p>
            <p className="text-gray-500 mt-2 font-medium">Total Buku</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center border-t-4 border-green-500">
            <p className="text-5xl font-bold text-green-600">{stats.anggota}</p>
            <p className="text-gray-500 mt-2 font-medium">Total Anggota</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center border-t-4 border-yellow-500">
            <p className="text-5xl font-bold text-yellow-600">
              {stats.peminjaman}
            </p>
            <p className="text-gray-500 mt-2 font-medium">Peminjaman Aktif</p>
          </div>
        </div>
      </div>

      {/* Fitur */}
      <div className="py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-gray-700 mb-8">
          Fitur Unggulan
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              icon: "📚",
              title: "Kelola Buku",
              desc: "Tambah, lihat, dan hapus koleksi buku perpustakaan dengan mudah.",
              link: "/buku",
            },
            {
              icon: "👥",
              title: "Kelola Anggota",
              desc: "Daftarkan anggota baru dan kelola data keanggotaan secara efisien.",
              link: "/anggota",
            },
            {
              icon: "🔖",
              title: "Peminjaman",
              desc: "Catat peminjaman buku dan pantau status pengembalian anggota.",
              link: "/peminjaman",
            },
          ].map((f, i) => (
            <Link
              to={f.link}
              key={i}
              className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition hover:-translate-y-1 border border-gray-100"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
