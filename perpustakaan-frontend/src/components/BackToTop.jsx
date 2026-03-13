import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl transition-all hover:scale-110 animate-fade-in bg-blue-700 hover:bg-blue-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white"
      title="Kembali ke atas"
    >
      ↑
    </button>
  );
}
