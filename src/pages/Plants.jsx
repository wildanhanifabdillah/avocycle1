import { useEffect, useMemo, useState } from "react";
import EditPlantModal from "./Modals/EditPlantModal";
import AddPlantModal from "./Modals/AddPlantModal";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import { loadPlants } from "../lib/plantStorage";
import { loadPhases } from "../lib/phaseStorage";

export default function Plants() {
  const [openModal, setOpenModal] = useState(false);
  const [openEditPlant, setOpenEditPlant] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [saved, setSaved] = useState([]);
  const [phaseTick, setPhaseTick] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 3;

  // 3 dummy cards to show by default
  const dummy = useMemo(
    () => [
      { id: 1, code: "P101", type: "mentega", date: "2025-09-03", period: 365, phase: "Fase Berbuah", health: "Sehat", image: "/avocado1.png" },
      { id: 2, code: "P201", type: "mentega", date: "2025-09-03", period: 365, phase: "Fase Berbuah", health: "Sakit", image: "/avocado1.png" },
      { id: 3, code: "P301", type: "miki",     date: "2025-09-03", period: 365, phase: "Fase Berbunga", health: "Sehat", image: "/avocado1.png" },
    ],
    []
  );
  const plants = useMemo(() => [...dummy, ...saved], [dummy, saved]);
  const totalPages = Math.max(1, Math.ceil(plants.length / pageSize));
  const current = useMemo(() => {
    const p = Math.min(Math.max(page, 1), totalPages);
    const start = (p - 1) * pageSize;
    return plants.slice(start, start + pageSize);
  }, [plants, page, totalPages]);

  // Helpers
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
    let months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (now.getDate() < d.getDate()) months -= 1;
    return Math.max(0, months);
  };

  // Load saved plants and refresh when modal closes or storage changes
  useEffect(() => {
    const load = () => setSaved(loadPlants());
    load();
    const onChanged = () => load();
    window.addEventListener("plants:changed", onChanged);
    const onPhase = () => setPhaseTick((t) => t + 1);
    window.addEventListener("phases:changed", onPhase);
    return () => {
      window.removeEventListener("plants:changed", onChanged);
      window.removeEventListener("phases:changed", onPhase);
    };
  }, []);
  useEffect(() => {
    if (!openModal) setSaved(loadPlants());
  }, [openModal]);

  // Derive phase label from stored phases per plant id
  const phasesMap = useMemo(() => {
    // gunakan phaseTick supaya dianggap dependency yang valid
    void phaseTick;

    const map = {};
    [...plants].forEach((p) => {
      try {
        const data = loadPhases(p.id);
        if (data?.berbuah?.length) map[p.id] = "Fase Berbuah";
        else if (data?.berbunga?.length) map[p.id] = "Fase Berbunga";
        else map[p.id] = p.phase || "Fase Tumbuh";
      } catch {
        map[p.id] = p.phase || "Fase Tumbuh";
      }
    });
    return map;
  }, [plants, phaseTick]);


  return (
    <div className="relative">
      {/* Daftar tanaman */}
      <div className="flex flex-col gap-4">
        {current.map((plant, idx) => (
          <div
            key={`${plant.code}-${idx}`}
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
                  <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${healthPillClass(plant.health)}`}>
                    {plant.health || "Sehat"}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-[#8C8C8C]">
                  <span className="inline-flex items-center gap-2">
                    <img
                      src="/icons/calendar.svg"
                      alt="calendar"
                      className="w-5 h-5"
                    />
                    {monthsDiffFrom(plant.date)} bulan
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <img
                      src="/icons/growth.svg"
                      alt="growth"
                      className="w-5 h-5"
                    />
                    {phasesMap[plant.id] || plant.phase || "Fase Berbuah"}
                  </span>
                </div>
                <div className="mt-1 text-sm text-[#8C8C8C]">
                  <p>Jenis: {plant.type === "mentega" ? "Alpukat Mentega" : plant.type === "miki" ? "Alpukat Miki" : "-"}</p>
                  <p>Tanggal Tanam: {formatDMY(plant.date)}</p>
                  <p>
                    Estimasi Panen: {(() => { const est = addDays(plant.date, plant.period); return est ? formatDMY(est.toISOString()) : "-"; })()}
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
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow text-sm mt-auto"
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
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          {`<`}
        </button>
        {Array.from({ length: totalPages }).slice(0, 3).map((_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={
                `h-8 w-8 rounded-full border text-sm ${
                  page === n
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 text-gray-700 hover:border-green-500'
                }`
              }
            >
              {n}
            </button>
          );
        })}
        {totalPages > 3 && <span className="px-1 text-gray-500">…</span>}
        <button
          className="px-2 py-1 text-gray-700 hover:text-green-700 disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          {`>`}
        </button>
      </div>

      {/* Tombol tambah tanaman */}
      <button
        onClick={() => setOpenModal(true)}
        className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
      >
        <FaPlus size={22} />
      </button>

      {openEditPlant && (
        <EditPlantModal
          initialData={selectedPlant}
          onClose={() => setOpenEditPlant(false)}
        />
      )}

      {openModal && <AddPlantModal onClose={() => setOpenModal(false)} />}
    </div>
  );
}
