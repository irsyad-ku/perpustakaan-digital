export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 animate-fade-in">
        <div className="text-center">
          <div className="text-5xl mb-4">🗑️</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Konfirmasi Hapus
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {message ||
              "Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium transition"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
