import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BukuPage from "./pages/BukuPage";
import AnggotaPage from "./pages/AnggotaPage";
import PeminjamanPage from "./pages/PeminjamanPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-blue-800 text-white p-4 flex gap-6 sticky top-0 z-50 shadow-md">
        <Link to="/" className="font-bold text-lg">
          Perpustakaan Digital
        </Link>
        <Link to="/buku" className="hover:underline">
          Buku
        </Link>
        <Link to="/anggota" className="hover:underline">
          Anggota
        </Link>
        <Link to="/peminjaman" className="hover:underline">
          Peminjaman
        </Link>
      </nav>

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buku" element={<BukuPage />} />
          <Route path="/anggota" element={<AnggotaPage />} />
          <Route path="/peminjaman" element={<PeminjamanPage />} />
        </Routes>
      </main>

      <footer className="bg-blue-800 text-white text-center p-4 mt-8">
        <p className="text-sm">
          &copy; 2026 Perpustakaan Digital. All rights reserved.
        </p>
        <p className="text-xs text-blue-300 mt-1">
          Dibangun dengan Laravel & React.js
        </p>
      </footer>
    </BrowserRouter>
  );
}
