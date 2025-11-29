// src/pages/Plants.jsx
import { Link } from "react-router-dom";
import { FaEdit, FaPlus } from "react-icons/fa";
import AddPlantModal from "./Modals/AddPlantModal";
import EditPlantModal from "./Modals/EditPlantModal";
import usePlants from "../hooks/usePlants";

export default function Plants() {
  const {
    current,
    totalPages,
    healthPillClass,
    formatDMY,
    addDays,
    monthsDiffFrom,
    phasesMap,

    openModal,
    openEditPlant,
    selectedPlant,
    page,

    setPage,
    setOpenModal,
    setOpenEditPlant,
    setSelectedPlant,
  } = usePlants();

  return (
    <div className="relative">

      {/* Daftar Tanaman */}
      <div className="flex flex-col gap-4">
        {current.map((plant) => (
          <div
            key={plant.id}
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
                  <h2 className="text-xl font-semibold">{plant.code}</h2>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-medium ${healthPillClass(
                      plant.health
                    )}`}
                  >
                    {plant.health || "Sehat"}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-[#8C8C8C]">
                  <span className="inline-flex items-center gap-2">
                    <img src="/icons/calendar.svg" className="w-5 h-5" />
                    {monthsDiffFrom(plant.date)} bulan
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <img src="/icons/growth.svg" className="w-5 h-5" />
                    {phasesMap[plant.id] || plant.phase}
                  </span>
                </div>

                <div className="mt-1 text-sm text-[#8C8C8C]">
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

            <div className="flex flex-col h-full items-end justify-between py-1">
              <FaEdit
                className="text-gray-400 hover:text-green-600 cursor-pointer"
                onClick={() => {
                  setSelectedPlant(plant);
                  setOpenEditPlant(true);
                }}
              />

              <Link
                to={`/dashboard/plants/${plant.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow text-sm mt-auto"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          className="px-2 py-1 text-gray-700 hover:text-green-700 disabled:opacity-40"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }).slice(0, 3).map((_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`h-8 w-8 rounded-full border text-sm ${
                page === n
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-300 text-gray-700 hover:border-green-500"
              }`}
            >
              {n}
            </button>
          );
        })}

        {totalPages > 3 && (
          <span className="px-1 text-gray-500">…</span>
        )}

        <button
          className="px-2 py-1 text-gray-700 hover:text-green-700 disabled:opacity-40"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          &gt;
        </button>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setOpenModal(true)}
        className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
      >
        <FaPlus size={22} />
      </button>

      {/* Modals */}
      {openEditPlant && (
        <EditPlantModal
          initialData={selectedPlant}
          onClose={() => setOpenEditPlant(false)}
        />
      )}

      {openModal && (
        <AddPlantModal onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
}
