export default function DeletePlantModal({ plant, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
        <h3 className="font-semibold text-lg text-red-600">
          Hapus Tanaman?
        </h3>

        <p className="text-sm">
          Apakah kamu yakin ingin menghapus tanaman{" "}
          <span className="font-bold">{plant.code}</span>? Tindakan ini tidak
          dapat dibatalkan.
        </p>

        <div className="flex justify-between pt-2">
          <button
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            Batal
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            type="button"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
