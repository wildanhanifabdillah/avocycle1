import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDMY } from "../utils/date";
import useCart from "../hooks/useCart";
import CartStatusModal from "../components/CartStatusModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function Keranjang() {
  const { bookings, loading, error, deleteBooking, userId } = useCart();
  const [deletingId, setDeletingId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [statusModal, setStatusModal] = useState({
    open: false,
    success: false,
    message: "",
  });

  const handleDelete = async (id) => {
    if (!id) return;
    setConfirm(id);
  };

  const confirmDelete = async () => {
    if (!confirm) return;
    try {
      setDeletingId(confirm);
      await deleteBooking(confirm);
      setStatusModal({
        open: true,
        success: true,
        message: "Pohon berhasil dihapus dari keranjang",
      });
    } catch (err) {
      console.error("Gagal hapus booking:", err);
      setStatusModal({
        open: true,
        success: false,
        message: "Pohon gagal dihapus. Coba lagi.",
      });
    } finally {
      setDeletingId(null);
      setConfirm(null);
    }
  };

  if (!userId) {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-2">Keranjang Pohon</h1>
        <p className="text-gray-600">
          User tidak ditemukan. Silakan login ulang.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Keranjang Pohon</h1>
          <p className="text-sm text-gray-600">
            Daftar booking pohon Anda.
          </p>
        </div>
      </div>

      {loading && <p className="text-gray-500">Memuat data booking...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && bookings.length === 0 && (
        <p className="text-gray-600">Belum ada pohon di keranjang.</p>
      )}

    <div className="flex flex-col gap-4">
      {bookings.map((item) => {
        const detailPath = item.plantId ? `/plants/${item.plantId}` : null;

        return (
          <div
            key={item.id}
            className="relative bg-white border-t-4 border-green-400 rounded-xl shadow-md hover:shadow-lg transition p-4 max-w-5xl w-full mx-auto"
          >
            <div className="flex gap-4 items-start">
              {/* FOTO */}
              <img
                src={item.image}
                alt={item.code}
                className="w-28 h-28 object-cover rounded-lg"
              />

              {/* DETAIL */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{item.code}</h2>

                <div className="text-sm text-gray-600 flex gap-6 mt-1">
                  <span className="flex gap-2 items-center">
                    <img src="/icons/calendar.svg" className="w-4 h-4" />
                    {item.ageMonths} bulan
                  </span>

                  <span className="flex gap-2 items-center">
                    <img src="/icons/growth.svg" className="w-4 h-4" />
                    {item.phase}
                  </span>
                </div>

                <div className="mt-1 text-sm text-gray-700">
                  <p>
                    Tanggal Tanam:{" "}
                    {item.plantedDate ? formatDMY(item.plantedDate) : "-"}
                  </p>
                  <p>Estimasi Panen: {item.estimateDate || "-"}</p>
                </div>
              </div>

              {/* TOMBOL AKSI */}
              <div className="self-end flex flex-col gap-3">
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className={`px-4 py-2 rounded-lg font-semibold text-white shadow text-sm ${
                    deletingId === item.id
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {deletingId === item.id ? "Menghapus..." : "Hapus Pohon"}
                </button>

                {detailPath ? (
                  <Link
                    to={detailPath}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow text-sm text-center"
                  >
                    Lihat Detail
                  </Link>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-500 font-semibold shadow text-sm text-center cursor-not-allowed"
                  >
                    Detail tidak tersedia
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>

      <DeleteConfirmModal
        open={!!confirm}
        loading={!!deletingId}
        onConfirm={confirmDelete}
        onCancel={() => setConfirm(null)}
        title="Yakin mau dihapus?"
        message="Anda akan menghapus pohon dari keranjang Anda."
      />

      <CartStatusModal
        open={statusModal.open}
        success={statusModal.success}
        message={statusModal.message}
        onClose={() => setStatusModal((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}
