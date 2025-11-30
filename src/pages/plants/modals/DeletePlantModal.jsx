import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

export default function DeletePlantModal({ plant, onClose, onConfirm }) {
  if (!plant) return null; // jaga-jaga

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
        {/* Tombol close (X) */}
        <button
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Tutup"
        >
          <FaTimes size={16} />
        </button>

        <div className="mb-3 flex items-center gap-2">
          <FaExclamationTriangle className="text-xl text-red-500" />
          <h2 className="text-lg font-semibold text-red-600">
            Hapus Tanaman?
          </h2>
        </div>

        <p className="mb-4 text-sm text-gray-700">
          Kamu yakin ingin menghapus tanaman{" "}
          <span className="font-semibold">
            {plant.code || `ID ${plant.id}`}
          </span>
          ? <br />
          Tindakan ini tidak bisa dibatalkan.
        </p>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
