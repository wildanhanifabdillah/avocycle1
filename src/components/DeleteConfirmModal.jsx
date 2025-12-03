export default function DeleteConfirmModal({
  open,
  title = "Yakin mau dihapus?",
  message = "Anda akan menghapus item ini.",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-5 w-[320px] text-center">
        <p className="font-semibold text-gray-800 mb-2">{title}</p>
        <p className="text-sm text-gray-600">{message}</p>

        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
