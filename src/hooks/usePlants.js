// src/hooks/usePlants.js
import { useEffect, useMemo, useState } from "react";
import { loadPlants } from "../helpers/plantStorage";
import { loadPhases } from "../helpers/phaseStorage";

export default function usePlants() {
  const [openModal, setOpenModal] = useState(false);
  const [openEditPlant, setOpenEditPlant] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const [saved, setSaved] = useState([]);
  const [phaseTick, setPhaseTick] = useState(0);

  const [page, setPage] = useState(1);
  const pageSize = 3;

  // Dummy data tetap ada sementara
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
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * pageSize;
    return plants.slice(start, start + pageSize);
  }, [plants, page, totalPages]);

  /** Helpers */
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

  /** Load from storage + event listeners */
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

  /** Hitung fase terbaru */
  const phasesMap = useMemo(() => {
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

  return {
    // Data
    current,
    totalPages,
    healthPillClass,
    formatDMY,
    addDays,
    monthsDiffFrom,
    phasesMap,

    // State
    openModal,
    openEditPlant,
    selectedPlant,
    page,

    // Setters
    setPage,
    setOpenModal,
    setOpenEditPlant,
    setSelectedPlant,
  };
}
