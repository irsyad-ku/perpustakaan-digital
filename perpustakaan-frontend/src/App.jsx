import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import BukuPage from "./pages/BukuPage";
import AnggotaPage from "./pages/AnggotaPage";
import PeminjamanPage from "./pages/PeminjamanPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import api from "./services/api";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import BackToTop from "./components/BackToTop";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-white/20 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

function Layout() {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Navbar — biru solid di light, glassmorphism di dark */}
      <nav className="sticky top-0 z-50 shadow-lg bg-blue-800 dark:bg-slate-900/70 dark:backdrop-blur-xl dark:border-b dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo + Links */}
          <div className="flex gap-2 items-center">
            <Link
              to="/"
              className="font-bold text-lg text-white mr-4 flex items-center gap-2"
            >
              📚 <span>Perpustakaan Digital</span>
            </Link>
            <NavLink to="/buku">Buku</NavLink>
            <NavLink to="/anggota">Anggota</NavLink>
            <NavLink to="/peminjaman">Peminjaman</NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-lg transition-all"
              title={dark ? "Aktifkan Light Mode" : "Aktifkan Dark Mode"}
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <span className="text-sm text-white/80">👤 {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buku" element={<BukuPage />} />
          <Route path="/anggota" element={<AnggotaPage />} />
          <Route path="/peminjaman" element={<PeminjamanPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900/80 dark:bg-slate-800/80 text-white text-center p-4 mt-8">
        <p className="text-sm opacity-80">
          &copy; 2026 Perpustakaan Digital. All rights reserved.
        </p>
      </footer>

      <BackToTop />
    </div>
  );
}

function AppRoutes() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/" /> : <RegisterPage />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
