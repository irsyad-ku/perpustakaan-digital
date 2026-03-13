import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import PageTransition from "../components/PageTransition";

export default function HomePage() {
  const [stats, setStats] = useState({ buku: 0, anggota: 0, peminjaman: 0 });
  const [statusData, setStatusData] = useState([]);
  const [kategoriData, setKategoriData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dark } = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [b, a, p] = await Promise.all([
          api.get("/bukus"),
          api.get("/anggotas"),
          api.get("/peminjamans"),
        ]);
        const bukuList = b.data.data ?? [];
        const pemList = p.data.data ?? [];

        setStats({
          buku: bukuList.length,
          anggota: a.data.data?.length ?? 0,
          peminjaman: pemList.filter((p) => p.status === "dipinjam").length,
        });

        const dipinjam = pemList.filter((p) => p.status === "dipinjam").length;
        const dikembalikan = pemList.filter(
          (p) => p.status === "dikembalikan",
        ).length;
        setStatusData([
          { name: "Dipinjam", value: dipinjam },
          { name: "Dikembalikan", value: dikembalikan },
        ]);

        const kategoriCount = {};
        bukuList.forEach((buku) => {
          const kat = buku.kategori || "Lainnya";
          kategoriCount[kat] = (kategoriCount[kat] || 0) + 1;
        });
        setKategoriData(
          Object.entries(kategoriCount).map(([name, jumlah]) => ({
            name,
            jumlah,
          })),
        );
      } catch (err) {
        console.error("Gagal memuat statistik:", err);
      } finally {
        setLoading(false); // ← selalu jalan, loading tidak stuck
      }
    };
    fetchStats();
  }, []);

  const PIE_COLORS = ["#f59e0b", "#22c55e"];
  const tooltipStyle = dark
    ? {
        backgroundColor: "#1e293b",
        border: "1px solid #334155",
        color: "#f1f5f9",
      }
    : {
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        color: "#1e293b",
      };
  const tickColor = dark ? "#94a3b8" : "#64748b";
  const gridColor = dark ? "#334155" : "#e2e8f0";

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">📚</div>
          <p className="text-gray-500 dark:text-slate-400">Memuat data...</p>
        </div>
      </div>
    );

  return (
    <PageTransition>
      <div className="dark:bg-slate-900">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 text-white py-24 px-6 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
              📚 Perpustakaan Digital
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Temukan, pinjam, dan kelola koleksi buku dengan mudah. Sistem
              perpustakaan modern berbasis web.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/buku"
                className="glass text-white font-bold px-8 py-3 rounded-xl hover:bg-white/30 transition shadow-lg"
              >
                Lihat Koleksi Buku
              </Link>
              <Link
                to="/peminjaman"
                className="bg-white text-blue-800 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition shadow-lg"
              >
                Peminjaman
              </Link>
            </div>
          </div>
        </div>

        {/* Statistik */}
        <div className="py-14 px-6 bg-gray-50 dark:bg-slate-800/50">
          <h2 className="text-center text-2xl font-bold text-gray-700 dark:text-slate-200 mb-8">
            Statistik Perpustakaan
          </h2>
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                label: "Total Buku",
                value: stats.buku,
                color: "border-blue-500",
                text: "text-blue-600 dark:text-blue-400",
              },
              {
                label: "Total Anggota",
                value: stats.anggota,
                color: "border-green-500",
                text: "text-green-600 dark:text-green-400",
              },
              {
                label: "Peminjaman Aktif",
                value: stats.peminjaman,
                color: "border-yellow-500",
                text: "text-yellow-600 dark:text-yellow-400",
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 text-center border-t-4 ${s.color} hover:shadow-lg transition hover:-translate-y-1`}
              >
                <p className={`text-5xl font-bold ${s.text}`}>{s.value}</p>
                <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Grafik */}
        <div className="py-14 px-6 max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-gray-700 dark:text-slate-200 mb-8">
            📊 Grafik & Laporan
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-700 dark:text-slate-200 mb-4">
                📚 Jumlah Buku per Kategori
              </h3>
              {kategoriData.length === 0 ? (
                <p className="text-center text-gray-400 py-10">
                  Belum ada data buku.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={kategoriData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: tickColor }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: tickColor }}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar
                      dataKey="jumlah"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Jumlah Buku"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-gray-700 dark:text-slate-200 mb-4">
                🔖 Status Peminjaman
              </h3>
              {statusData.every((d) => d.value === 0) ? (
                <p className="text-center text-gray-400 py-10">
                  Belum ada data peminjaman.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ color: tickColor }} />
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Fitur Unggulan */}
        <div className="py-14 px-6 max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-gray-700 dark:text-slate-200 mb-8">
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
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition hover:-translate-y-1 border border-gray-100 dark:border-slate-700 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm">
                  {f.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
