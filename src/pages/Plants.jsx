import { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import usePlants from "../hooks/usePlants";
import { monthsDiff, estimate, healthClass } from "../helpers/plantUtils";

import AddPlantModal from "./Modals/AddPlantModal";
import EditPlantModal from "./Modals/EditPlantModal";
import DeletePlantModal from "./Modals/DeletePlantModal";

export default function Plants() {
  const { kebunId: kebunIdParam } = useParams();
  const kebunId =
    kebunIdParam && kebunIdParam !== "undefined" && kebunIdParam !== "null"
      ? kebunIdParam
      : null;
  const {
    plants,
    loading,
    error,
    page,
    meta,
    setPage,
    reload,
    deletePlant,
  } = usePlants(kebunId);

  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const totalPages = meta.total_pages ?? 1;

  if (!kebunId || kebunId === "undefined" || kebunId === "null") {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-4">Tanaman di Kebun</h1>
        <p className="text-gray-600">
          Pilih kebun dari daftar kebun untuk melihat tanamannya.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Tanaman di Kebun {kebunId}</h1>

      {loading && <p className="text-gray-500">Memuat data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col gap-4">
        {plants.map((p) => (
        <div
          key={p.id}
          className="relative bg-white border-t-4 border-green-400 rounded-xl shadow-md hover:shadow-lg transition p-4 max-w-5xl w-full mx-auto"
        >
          <div className="absolute right-3 top-3 flex items-center gap-3 text-[20px]">
            <FaEdit
              className="text-gray-400 hover:text-green-600 cursor-pointer"
              onClick={() => setEditing(p)}
            />
            <FaTrash
              className="text-red-400 hover:text-red-600 cursor-pointer"
              onClick={() => setDeleting(p)}
            />
          </div>

          {/* ROW UTAMA — foto + detail + button */}
          <div className="flex gap-4 items-start">
            <img src={p.image} className="w-28 h-28 object-cover rounded-lg" />

            {/* Kiri: data tanaman */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{p.code}</h2>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${healthClass(p.health)}`}
                >
                  {p.health}
                </span>
              </div>

              <div className="text-sm text-gray-600 flex gap-6 mt-1">
                <span className="flex gap-2 items-center">
                  <img src="/icons/calendar.svg" className="w-4 h-4" /> {monthsDiff(p.date)} bulan
                </span>
                <span className="flex gap-2 items-center">
                  <img src="/icons/growth.svg" className="w-4 h-4" /> {p.phase}
                </span>
              </div>

              <div className="mt-1 text-sm text-gray-700">
                <p>
                  Jenis:{" "}
                  {p.type === "mentega"
                    ? "Alpukat Mentega"
                    : p.type === "miki"
                    ? "Alpukat Miki"
                    : "-"}
                </p>
                <p>Tanggal tanam: {p.fmtDate}</p>
                <p>Estimasi panen: {estimate(p.date, p.period)}</p>
              </div>
            </div>

            {/* Button di bagian kanan, sejajar dengan estimasi panen */}
            <div className="self-end">
              <Link
                to={`/kebun/${kebunId}/plants/${p.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow text-sm"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-3">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          {"<"}
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-full ${
              page === i + 1 ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          {">"}
        </button>
      </div>

      {/* FAB Add Button */}
      <button
        onClick={() => setOpenAdd(true)}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg"
      >
        <FaPlus size={22} />
      </button>

      {openAdd && (
        <AddPlantModal
          kebunId={kebunId}
          onClose={() => setOpenAdd(false)}
          onSuccess={() => {
            reload(page);
            setOpenAdd(false);
          }}
        />
      )}

      {editing && (
        <EditPlantModal
          open={!!editing}
          kebunId={kebunId}
          initialData={{
            id: editing?.id,
            name: editing?.nama_tanaman || editing?.name,
            type: editing?.type,
            date: editing?.date,
            period: editing?.period,
            code: editing?.code,
            block: editing?.kode_blok || editing?.block,
            kebunId: kebunId,
          }}
          onClose={() => setEditing(null)}
          onSave={() => {
            reload(page);
            setEditing(null);
          }}
        />
      )}

      {deleting && (
        <DeletePlantModal
          plant={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            await deletePlant(deleting.id);
            setDeleting(null);
            reload(page);
          }}
        />
      )}
    </div>
  );
}
