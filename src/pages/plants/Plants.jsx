// src/pages/dashboard/Plants.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import AddPlantModal from "./modals/AddPlantModal";
import EditPlantModal from "./modals/EditPlantModal";
import DeletePlantModal from "./modals/DeletePlantModal";
import {
  FaEdit,
  FaPlus,
  FaCalendarAlt,
  FaChartBar,
  FaTrash,
  FaEye,
} from "react-icons/fa";

const PAGE_SIZE = 3;

export default function Plants() {
  const { kebunId } = useParams();

  const [openModal, setOpenModal] = useState(false);
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);
  const [deletingPlant, setDeletingPlant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ==== helper (healthPillClass, formatDMY, addDays, monthsDiffFrom, visiblePages) ==== //

  const healthPillClass = (val) => {
    const v = String(val || "Sehat").toLowerCase();
    return v === "sakit"
      ? "border border-red-400 text-red-600 bg-red-50"
      : "border border-green-500 text-green-700 bg-green-50";
  };

  const formatDMY = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const addDays = (iso, days) => {
    if (!iso || !days) return null;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    d.setDate(d.getDate() + Number(days));
    return d;
  };

  const monthsDiffFrom = (iso) => {
    if (!iso) return 0;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 0;
    const now = new Date();
    let months =
      (now.getFullYear() - d.getFullYear()) * 12 +
      (now.getMonth() - d.getMonth());
    if (now.getDate() < d.getDate()) months -= 1;
    return Math.max(0, months);
  };

  const visiblePages = useMemo(() => {
    const maxButtons = 3;
    const count = Math.min(totalPages, maxButtons);
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [totalPages]);

  // ================== FETCH ================== //
  const fetchPlants = useCallback(
    async (currentPage = 1) => {
      if (!kebunId) {
        setError("Kebun tidak ditemukan.");
        setPlants([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const url = `http://localhost:2005/api/v1/tanaman/by-kebun/${kebunId}?page=${currentPage}&per_page=${PAGE_SIZE}`;

        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) throw new Error("Failed to fetch plants");
        const json = await res.json();

        const mappedPlants = (json.data || []).map((plant) => {
          const id = plant.ID ?? plant.id;
          const kodeTanaman = plant.KodeTanaman ?? plant.kode_tanaman;
          const varietas = plant.Varietas ?? plant.varietas;
          const tanggalTanam =
            plant.TanggalTanam ?? plant.tanggal_tanam ?? plant.tanggalTanam;
          const masaProduksi =
            plant.MasaProduksi ?? plant.masa_produksi ?? plant.masaProduksi;
          const foto = plant.FotoTanaman ?? plant.foto_tanaman;

          return {
            id,
            code: kodeTanaman,
            type:
              varietas === "Var1"
                ? "mentega"
                : varietas === "Var2"
                ? "miki"
                : "other",
            date: tanggalTanam,
            period: masaProduksi,
            phase: "Fase Tumbuh",
            health: "Sehat",
            image: foto || "/avocado1.png",
          };
        });

        setPlants(mappedPlants);
        setTotalPages(json.meta?.total_pages || 1);
      } catch (err) {
        console.error("Error fetching plants:", err);
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    },
    [kebunId]
  );

  useEffect(() => {
    setPage(1);
    fetchPlants(1);
  }, [fetchPlants]);

  useEffect(() => {
    if (!kebunId) return;
    fetchPlants(page);
  }, [page, kebunId, fetchPlants]);

  // ================== HAPUS TANAMAN ================== //
  const handleConfirmDelete = async () => {
    if (!deletingPlant) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:2005/api/v1/tanaman/${deletingPlant.id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Gagal menghapus tanaman");
      }

      // update FE
      setPlants((prev) => prev.filter((p) => p.id !== deletingPlant.id));
      setDeletingPlant(null);

      // kalau mau full sinkron:
      // await fetchPlants(page);
    } catch (err) {
      console.error("Delete plant error:", err);
      alert(err.message || "Gagal menghapus tanaman");
    }
  };

  // ================== RENDER ================== //
  return (
    <div className="relative">
      <h1 className="mb-4 text-xl font-semibold">
        Tanaman di Kebun #{kebunId}
      </h1>

      {loading && (
        <p className="mb-3 text-center text-gray-500">
          Loading data tanaman...
        </p>
      )}
      {error && (
        <p className="mb-3 text-center text-red-500">Error: {error}</p>
      )}

      {/* Daftar tanaman */}
      <div className="flex flex-col gap-4">
        {plants.map((plant) => (
          <div
            key={plant.id || plant.code}
            className="bg-white border-t-4 border-green-400 rounded-xl shadow-md flex justify-between items-stretch p-4 hover:shadow-lg transition max-w-4xl w-full mx-auto h-40"
          >
            <div className="flex items-stretch gap-4 h-full">
              <img
                src={plant.image || "/avocado1.png"}
                alt={plant.code}
                className="w-28 h-full object-cover rounded-lg"
              />

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">
                    {plant.code || "-"}
                  </h2>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-medium ${healthPillClass(
                      plant.health
                    )}`}
                  >
                    {plant.health || "Sehat"}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <FaCalendarAlt className="text-green-600" />
                    {monthsDiffFrom(plant.date)} bulan
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FaChartBar className="text-green-600" />
                    {plant.phase || "Fase Berbuah"}
                  </span>
                </div>

                <div className="mt-1 flex flex-col gap-1 text-sm">
                  <p>
                    Jenis:{" "}
                    {plant.type === "mentega"
                      ? "Alpukat Mentega"
                      : plant.type === "miki"
                      ? "Alpukat Miki"
                      : "-"}
                  </p>
                  <p>Tanggal Tanam: {formatDMY(plant.date)}</p>
                  <p>
                    Estimasi Panen:{" "}
                    {(() => {
                      const est = addDays(plant.date, plant.period);
                      return est ? formatDMY(est.toISOString()) : "-";
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* Aksi kanan */}
            <div className="flex h-full flex-col items-end justify-center">
              <div className="flex gap-4">
                <Link
                  to={`/kebun/${kebunId}/plants/${plant.id}`}
                  className="cursor-pointer text-[22px] text-gray-600 hover:text-green-600"
                  title="Lihat Detail"
                >
                  <FaEye />
                </Link>
                <FaEdit
                  className="cursor-pointer text-[22px] text-gray-400 hover:text-green-600"
                  onClick={() => setEditingPlant(plant)}
                  title="Edit tanaman"
                />
                <FaTrash
                  className="cursor-pointer text-[22px] text-red-400 hover:text-red-600"
                  onClick={() => setDeletingPlant(plant)}
                  title="Hapus tanaman"
                />
              </div>
            </div>
          </div>
        ))}

        {!loading && !error && plants.length === 0 && (
          <p className="text-center text-gray-500">
            Belum ada data tanaman yang ditampilkan.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          className="px-2 py-1 text-gray-700 hover:text-green-700 disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          {"<"}
        </button>

        {visiblePages.map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`h-8 w-8 rounded-full border text-sm ${
              page === n
                ? "border-green-600 bg-green-600 text-white"
                : "border-gray-300 text-gray-700 hover:border-green-500"
            }`}
          >
            {n}
          </button>
        ))}

        {totalPages > visiblePages.length && (
          <span className="px-1 text-sm text-gray-500">…</span>
        )}

        <button
          className="px-2 py-1 text-gray-700 hover:text-green-700 disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          {">"}
        </button>
      </div>

      {/* Tombol tambah tanaman */}
      <button
        onClick={() => setOpenModal(true)}
        className="fixed bottom-8 right-8 transform rounded-full bg-green-600 p-4 text-white shadow-lg transition hover:scale-110 hover:bg-green-700"
      >
        <FaPlus size={22} />
      </button>

      {openModal && (
        <AddPlantModal
          onClose={() => setOpenModal(false)}
          kebunId={kebunId}
          onSuccess={(created) => {
            // cara paling aman: refetch dari backend
            fetchPlants(page);
            setOpenModal(false);
          }}
        />
      )}

      {editingPlant && (
        <EditPlantModal
          initialData={editingPlant}
          kebunId={kebunId}
          onClose={() => setEditingPlant(null)}
          onSave={(updated) => {
            if (!updated) return;
            setPlants((prev) =>
              prev.map((p) =>
                p.id === updated.id
                  ? {
                      ...p,
                      type: updated.type ?? p.type,
                      date: updated.date ?? p.date,
                      period: updated.period ?? p.period,
                      code: updated.code ?? p.code,
                    }
                  : p
              )
            );
            setEditingPlant(null);
          }}
        />
      )}

      {deletingPlant && (
        <DeletePlantModal
          plant={deletingPlant}
          onClose={() => setDeletingPlant(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
