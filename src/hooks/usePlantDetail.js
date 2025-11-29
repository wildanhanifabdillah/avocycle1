import { useEffect, useMemo, useRef, useState } from "react";
import { loadPhases, savePhases } from "../helpers/phaseStorage";
import { parseDMY, addMonths, fmtDMY } from "../utils/date";

export default function usePlantDetail(id) {
  const [phases, setPhases] = useState({ berbunga: [], berbuah: [] });
  const [loaded, setLoaded] = useState(false);

  const [openFlowerModal, setOpenFlowerModal] = useState(false);
  const [openFruitModal, setOpenFruitModal] = useState(false);
  const [openEditPlant, setOpenEditPlant] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState(null);

  const lineAreaRef = useRef(null);
  const stepRefs = useRef([]);

  const [progressPx, setProgressPx] = useState(0);

  // Load phases
  useEffect(() => {
    const data = loadPhases(id);
    setPhases({
      berbunga: data.berbunga || [],
      berbuah: data.berbuah || [],
    });
    setLoaded(true);
  }, [id]);

  // Save phases
  useEffect(() => {
    if (!loaded) return;
    savePhases(id, phases);
  }, [id, phases, loaded]);

  // Select latest phase
  const faseBerbungaData = useMemo(
    () => (phases.berbunga.length ? phases.berbunga.at(-1) : null),
    [phases.berbunga]
  );

  const faseBerbuahData = useMemo(
    () => (phases.berbuah.length ? phases.berbuah.at(-1) : null),
    [phases.berbuah]
  );

  // Mutators
  const addFaseBerbunga = (entry) =>
    setPhases((prev) => ({ ...prev, berbunga: [...prev.berbunga, entry] }));

  const addFaseBerbuah = (entry) =>
    setPhases((prev) => ({ ...prev, berbuah: [...prev.berbuah, entry] }));

  // Step completion logic
  const step1Done = phases.berbunga.length > 0;
  const step2Done = phases.berbuah.length > 0;

  const latestEstimasi = useMemo(() => {
    const last = phases.berbuah.at(-1);
    if (!last?.estimasi) return null;

    const [d, m, y] = last.estimasi.split("/");
    const year = y.length === 2 ? 2000 + Number(y) : Number(y);
    const date = new Date(year, Number(m) - 1, Number(d));

    return isNaN(date.getTime()) ? null : date;
  }, [phases.berbuah]);

  const step3Done = latestEstimasi ? new Date() >= latestEstimasi : false;

  const lastReached = step3Done ? 2 : step2Done ? 1 : step1Done ? 0 : -1;

  // Progress bar width
  useEffect(() => {
    const calc = () => {
      const area = lineAreaRef.current;
      const target = stepRefs.current[lastReached];

      if (!area || lastReached < 0 || !target) {
        setProgressPx(0);
        return;
      }

      const areaRect = area.getBoundingClientRect();
      const circleRect = target.getBoundingClientRect();

      const center = circleRect.left + circleRect.width / 2;
      const width = Math.max(0, Math.min(areaRect.width, center - areaRect.left));

      setProgressPx(width);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);

  }, [lastReached, phases.berbuah.length, phases.berbunga.length]);

  // Generate estimasi (logikanya dipindah dari JSX)
  const generateEstimasi = (data) => {
    let estimasi = "";

    try {
      const metaRaw = localStorage.getItem(`plant:${id}:meta`);
      const meta = metaRaw ? JSON.parse(metaRaw) : null;

      const iso = meta?.date;
      const periodDays = Number(meta?.period || 0);

      if (iso && periodDays > 0) {
        const planted = new Date(iso);
        if (!isNaN(planted.getTime())) {
          planted.setDate(planted.getDate() + periodDays);
          estimasi = fmtDMY(planted);
        }
      }
    } catch {
        // ignore error
    }

    if (!estimasi) {
      const base = parseDMY(data?.date);
      estimasi = base ? fmtDMY(addMonths(base, 3)) : "";
    }

    return estimasi;
  };

  return {
    // states
    phases,
    openFlowerModal,
    openFruitModal,
    openEditPlant,
    expandedPhase,
    progressPx,

    // refs
    lineAreaRef,
    stepRefs,

    // computed
    faseBerbungaData,
    faseBerbuahData,
    step1Done,
    step2Done,
    step3Done,

    // setters
    setOpenFlowerModal,
    setOpenFruitModal,
    setOpenEditPlant,
    setExpandedPhase,

    // actions
    addFaseBerbunga,
    addFaseBerbuah,
    generateEstimasi,
  };
}
