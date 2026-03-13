import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(", "));
      } else {
        setError(err.response?.data?.message || "Registrasi gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="glass dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-700">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📚</div>
            <h1 className="text-2xl font-bold text-white dark:text-slate-100">
              Perpustakaan Digital
            </h1>
            <p className="text-blue-200 dark:text-slate-400 text-sm mt-1">
              Buat akun baru
            </p>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 px-4 py-2 rounded-lg mb-5 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 dark:text-slate-300 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="email@contoh.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 dark:text-slate-300 mb-1">
                Konfirmasi Password
              </label>
              <input
                type="password"
                value={form.password_confirmation}
                onChange={(e) =>
                  setForm({ ...form, password_confirmation: e.target.value })
                }
                className={inputClass}
                placeholder="Ulangi password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white dark:bg-blue-600 text-blue-800 dark:text-white font-bold py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-700 transition disabled:opacity-50 shadow-md mt-2"
            >
              {loading ? "⏳ Memproses..." : "🚀 Daftar Sekarang"}
            </button>
          </form>

          <p className="text-center text-sm text-blue-200 dark:text-slate-400 mt-6">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-white dark:text-blue-400 hover:underline font-semibold"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
