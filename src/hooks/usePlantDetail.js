import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  fmtDMY,
  // parseDMY,
  formatDMY,
  monthsDiffFrom,
} from "../utils/date";
import FaseService from "../services/FaseService";
import LogPenyakitService from "../services/LogPenyakitService";

const toIso = (d) => {
  if (!d) return "";
  if (d.includes("/")) {
    const [dd, mm, yy] = d.split("/");
    const year = yy.length === 2 ? `20${yy}` : yy;
    return `${year}-${mm}-${dd}`;
  }
  return d.slice(0, 10);
};

export default function usePlantDetail(id) {
  // ================================
  // STATE PLANT
  // ================================
  const [plant, setPlant] = useState(null);
  const [loadingPlant, setLoadingPlant] = useState(false);
  const [errorPlant, setErrorPlant] = useState(null);

  // ================================
  // STATE PHASES
  // ================================
  const [phases, setPhases] = useState({
    berbunga: [],
    berbuah: [],
    panen: [],
  });

  const [loadingFaseBunga, setLoadingFaseBunga] = useState(false);
  const [errorFaseBunga, setErrorFaseBunga] = useState(null);

  const [loadingFaseBuah, setLoadingFaseBuah] = useState(false);
  const [errorFaseBuah, setErrorFaseBuah] = useState(null);

  const [loadingFasePanen, setLoadingFasePanen] = useState(false);
  const [errorFasePanen, setErrorFasePanen] = useState(null);

  // ================================
  // STATE MODALS
  // ================================
  const [openFlowerModal, setOpenFlowerModal] = useState(false);
  const [openFruitModal, setOpenFruitModal] = useState(false);
  const [openPanenModal, setOpenPanenModal] = useState(false);
  const [openEditPlant, setOpenEditPlant] = useState(false);

  const [editingFlower, setEditingFlower] = useState(null);
  const [editingFruit, setEditingFruit] = useState(null);
  const [editingPanen, setEditingPanen] = useState(null);

  const [expandedPhase, setExpandedPhase] = useState(null);

  // ================================
  // TIMELINE
  // ================================
  const lineAreaRef = useRef(null);
  const stepRefs = useRef([]);
  const [progressPx, setProgressPx] = useState(0);

  // ================================
  // FETCH TANAMAN + LOG PENYAKIT
  // ================================
  useEffect(() => {
    const fetchPlantAndDisease = async () => {
      if (!id) return;
      setLoadingPlant(true);
      setErrorPlant(null);

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:2005/api/v1/tanaman/${id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );

        if (!res.ok) throw new Error("Gagal mengambil data tanaman");

        const json = await res.json();
        const raw = json.data || {};

        // backend variants
        const kodeTanaman = raw.KodeTanaman ?? raw.kode_tanaman;
        const namaTanaman = raw.NamaTanaman ?? raw.nama_tanaman;
        const kodeBlok = raw.KodeBlok ?? raw.kode_blok;
        const varietas = raw.Varietas ?? raw.varietas;
        const tanggalTanamIso =
          raw.TanggalTanam ?? raw.tanggal_tanam ?? raw.tanggalTanam;
        const masaProduksi =
          raw.MasaProduksi ?? raw.masa_produksi ?? raw.masaProduksi;
        const foto = raw.FotoTanaman ?? raw.foto_tanaman;
        const kebunId = raw.KebunID ?? raw.kebun_id ?? raw.kebunId;
        const health =
          raw.StatusKesehatan ??
          raw.status_kesehatan ??
          raw.health ??
          raw.Health ??
          "Sehat";

        // meta localStorage
        let meta = null;
        try {
          const metaRaw = localStorage.getItem(`plant:${id}:meta`);
          meta = metaRaw ? JSON.parse(metaRaw) : null;
        } catch {
          meta = null;
        }

        const plantedIso = tanggalTanamIso || meta?.date || null;
        const plantedDateObj = plantedIso ? new Date(plantedIso) : null;
        const periodDays = Number(meta?.period || masaProduksi || 0);
        const ageMonths = plantedIso ? monthsDiffFrom(plantedIso) : 0;

        // fetch disease logs
        let diseaseHistory = [];
        try {
          const logs = await LogPenyakitService.getByTanaman(id);
          diseaseHistory = (logs || []).map((log) => {
            const kode =
              log.tanaman?.kode_tanaman ??
              log.tanaman?.KodeTanaman ??
              kodeTanaman ??
              `Tanaman #${id}`;
            const dateStr = log.created_at ?? log.createdAt ?? "";
            const d = dateStr ? new Date(dateStr) : null;
            const dateLabel = d && !Number.isNaN(d) ? fmtDMY(d) : "-";
            return {
              date: dateLabel,
              component: kode,
              disease: log.penyakit?.nama_penyakit ?? log.nama_penyakit ?? "-",
              status: log.kondisi ?? log.status ?? "-",
            };
          });
        } catch {
          diseaseHistory = [];
        }

        const plantView = {
          id: raw.ID ?? raw.id ?? id,
          code: meta?.code || kodeTanaman || `Tanaman #${id}`,
          name: namaTanaman,
          block: kodeBlok,
          kebunId,
          varietas,
          plantedIso,
          periodDays,
          ageMonths,
          dateLabel: plantedDateObj ? fmtDMY(plantedDateObj) : "-",
          health,
          image: foto || "/avocado1.png",
          stages: [
            { id: 1, name: "Fase Berbunga" },
            { id: 2, name: "Fase Berbuah" },
            { id: 3, name: "Fase Panen" },
          ],
          growthHistory: [
            {
              badge: "Fase 1",
              title: "Fase Berbunga",
              desc: "Silakan isi saat pohon muncul bunga",
            },
            {
              badge: "Fase 2",
              title: "Fase Berbuah",
              desc: "Silakan isi saat pohon muncul buah",
            },
            {
              badge: "Fase 3",
              title: "Fase Siap Panen",
              desc: "Buah sudah siap dipanen",
            },
          ],
          diseaseHistory,
        };

        setPlant(plantView);
      } catch (err) {
        setErrorPlant(err.message);
      } finally {
        setLoadingPlant(false);
      }
    };

    fetchPlantAndDisease();
  }, [id]);

  // ================================
  // FETCH FASE 1 – BERBUNGA
  // ================================
  useEffect(() => {
    const fetchFaseBunga = async () => {
      if (!id) return;

      setLoadingFaseBunga(true);
      setErrorFaseBunga(null);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:2005/api/v1/petani/fase-bunga/tanaman/${id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );

        if (!res.ok) throw new Error("Gagal mengambil data fase berbunga");

        const json = await res.json();

        const list = (json.data || []).map((fb) => {
          const rawDate =
            fb.TanggalCatat ?? fb.tanggal_catat ?? fb.tanggalCatat;

          let iso = "";
          if (rawDate) {
            const d = new Date(rawDate);
            if (!isNaN(d)) iso = d.toISOString().slice(0, 10);
          }

          return {
            id: fb.ID ?? fb.id,
            backend: fb,
            date: iso,
            munculBunga: fb.JumlahBunga ?? fb.jumlah_bunga,
            pecahBunga: fb.BungaPecah ?? fb.bunga_pecah,
            pentilPertama: fb.PentilMuncul ?? fb.pentil_muncul,
          };
        });

        setPhases((p) => ({ ...p, berbunga: list }));
      } catch (err) {
        setErrorFaseBunga(err.message);
      } finally {
        setLoadingFaseBunga(false);
      }
    };

    fetchFaseBunga();
  }, [id]);

  // ================================
  // FETCH FASE 2 – BERBUAH
  // ================================
  useEffect(() => {
    const fetchFaseBuah = async () => {
      if (!id) return;

      setLoadingFaseBuah(true);
      setErrorFaseBuah(null);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:2005/api/v1/petani/fase-berbuah/tanaman/${id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );

        if (!res.ok) throw new Error("Gagal mengambil data fase berbuah");

        const json = await res.json();

        const list = (json.data || []).map((fb) => {
          const tanggal = fb.TanggalCover ?? fb.tanggal_cover;
          const estimasi = fb.EstimasiPanen ?? fb.estimasi_panen;
          const label = fb.WarnaLabel ?? fb.warna_label;

          let iso = "";
          if (tanggal) {
            const d = new Date(tanggal);
            if (!isNaN(d)) iso = d.toISOString().slice(0, 10);
          }

          return {
            id: fb.ID ?? fb.id,
            backend: fb,
            date: iso,
            cover: fb.JumlahCover ?? fb.jumlah_cover,
            labelColor: label || "red",
            estimasi: estimasi ? formatDMY(estimasi) : "",
          };
        });

        setPhases((p) => ({ ...p, berbuah: list }));
      } catch (err) {
        setErrorFaseBuah(err.message);
      } finally {
        setLoadingFaseBuah(false);
      }
    };

    fetchFaseBuah();
  }, [id]);

  // ================================
  // FETCH FASE 3 – PANEN
  // ================================
  useEffect(() => {
    const fetchFasePanen = async () => {
      if (!id) return;

      setLoadingFasePanen(true);
      setErrorFasePanen(null);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:2005/api/v1/petani/fase-panen/tanaman/${id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );

        if (!res.ok) throw new Error("Gagal mengambil data fase panen");

        const json = await res.json();

        const list = (json.data || []).map((fp) => {
          const rawDate =
            fp.TanggalPanenAktual ??
            fp.tanggal_panen_aktual ??
            fp.tanggalPanenAktual;

          let iso = "";
          if (rawDate) {
            const d = new Date(rawDate);
            if (!isNaN(d)) iso = d.toISOString().slice(0, 10);
          }

          return {
            id: fp.ID ?? fp.id,
            backend: fp,
            date: iso,
            jumlahPanen: fp.JumlahPanen ?? fp.jumlah_panen,
            jumlahSampel: fp.JumlahSampel ?? fp.jumlah_sampel,
            beratTotal: fp.BeratTotal ?? fp.berat_total,
            catatan: fp.Catatan ?? fp.catatan,
            fotoPanen: fp.FotoPanen ?? fp.foto_panen,
          };
        });

        setPhases((p) => ({ ...p, panen: list }));
      } catch (err) {
        setErrorFasePanen(err.message);
      } finally {
        setLoadingFasePanen(false);
      }
    };

    fetchFasePanen();
  }, [id]);

  // ================================
  // TIMELINE COMPUTATION
  // ================================
  const step1Done = phases.berbunga.length > 0;
  const step2Done = phases.berbuah.length > 0;
  const step3Done = phases.panen.length > 0;

  const lastReached =
    step3Done ? 2 : step2Done ? 1 : step1Done ? 0 : -1;

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
      const width = Math.min(areaRect.width, center - areaRect.left);
      setProgressPx(width);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [lastReached, phases.berbuah.length, phases.berbunga.length]);

  // ================================
  // SAFE FALLBACK
  // ================================
  const safePlant =
    plant || {
      id,
      code: `Tanaman #${id}`,
      name: `Tanaman #${id}`,
      dateLabel: "-",
      ageMonths: 0,
      health: "Sehat",
      image: "/avocado1.png",
      stages: [
        { id: 1, name: "Fase Berbunga" },
        { id: 2, name: "Fase Berbuah" },
        { id: 3, name: "Fase Panen" },
      ],
      growthHistory: [],
      diseaseHistory: [],
    };

  const faseBerbuahData = useMemo(
    () =>
      phases.berbuah.length
        ? phases.berbuah[phases.berbuah.length - 1]
        : null,
    [phases.berbuah]
  );

  // ================================
  // HANDLER SAVE (MODAL INPUT)
  // ================================
  const handleSaveFlower = useCallback(
    async (created) => {
      try {
        const payload = {
          minggu_ke: 1,
          tanggal_catat: toIso(created?.date),
          jumlah_bunga: Number(created?.munculBunga || 0),
          bunga_pecah: Number(created?.pecahBunga || 0),
          pentil_muncul: Number(created?.pentilPertama || 0),
          tanaman_id: Number(id),
        };

        const res = await FaseService.createBerbunga(payload);
        const saved = res?.data ?? res ?? payload;

        const rawDate =
          saved.TanggalCatat ?? saved.tanggal_catat ?? saved.tanggalCatat;
        let iso = "";
        if (rawDate) {
          const d = new Date(rawDate);
          if (!isNaN(d)) iso = d.toISOString().slice(0, 10);
        }

        const createdId = saved.ID ?? saved.id ?? Date.now();
        const view = {
          id: createdId,
          backend: saved,
          date: iso,
          munculBunga:
            saved.JumlahBunga ?? saved.jumlah_bunga ?? payload.jumlah_bunga,
          pecahBunga:
            saved.BungaPecah ?? saved.bunga_pecah ?? payload.bunga_pecah,
          pentilPertama:
            saved.PentilMuncul ??
            saved.pentil_muncul ??
            payload.pentil_muncul,
        };

        setPhases((prev) => {
          const exists = prev.berbunga.some((b) => b.id === createdId);
          const updated = exists
            ? prev.berbunga.map((b) => (b.id === createdId ? view : b))
            : [...prev.berbunga, view];

          return { ...prev, berbunga: updated };
        });
      } catch (err) {
        console.error("Gagal simpan fase bunga:", err);
        alert("Gagal menyimpan fase bunga");
      }
    },
    [id]
  );

  const handleSaveFruit = useCallback(
    async (created) => {
      try {
        const payload = {
          minggu_ke: 1,
          tanggal_catat: toIso(created?.date) || toIso(created?.estimasi),
          tanggal_cover: toIso(created?.date),
          jumlah_cover: Number(created?.cover || 0),
          warna_label: created?.labelColor || "Hijau",
          estimasi_panen:
            toIso(created?.estimasi) ||
            toIso(created?.date) ||
            toIso(plant?.plantedIso),
          tanaman_id: Number(id),
        };

        const res = await FaseService.createBerbuah(payload);
        const saved = res?.data ?? res ?? payload;

        const tanggalCover =
          saved.TanggalCover ?? saved.tanggal_cover ?? payload.tanggal_cover;
        const estimasiPanen =
          saved.EstimasiPanen ?? saved.estimasi_panen ?? payload.estimasi_panen;
        const warna =
          saved.WarnaLabel ?? saved.warna_label ?? payload.warna_label;

        let iso = "";
        if (tanggalCover) {
          const d = new Date(tanggalCover);
          if (!isNaN(d)) iso = d.toISOString().slice(0, 10);
        }

        const createdId = saved.ID ?? saved.id ?? Date.now();
        const view = {
          id: createdId,
          backend: saved,
          date: iso,
          cover: saved.JumlahCover ?? saved.jumlah_cover ?? payload.jumlah_cover,
          labelColor: warna || "red",
          estimasi: estimasiPanen ? formatDMY(estimasiPanen) : "",
        };

        setPhases((prev) => {
          const exists = prev.berbuah.some((b) => b.id === createdId);
          const updated = exists
            ? prev.berbuah.map((b) => (b.id === createdId ? view : b))
            : [...prev.berbuah, view];

          return { ...prev, berbuah: updated };
        });
      } catch (err) {
        console.error("Gagal simpan fase berbuah:", err);
        alert("Gagal menyimpan fase berbuah");
      }
    },
    [id, plant?.plantedIso]
  );

  const handleSavePanen = useCallback(
    async (created) => {
      try {
        const payload = {
          tanggal_panen_aktual: toIso(created?.date),
          jumlah_panen: Number(created?.jumlahPanen || 0),
          jumlah_sampel: Number(created?.jumlahSampel || 0),
          berat_total: Number(created?.beratTotal || 0),
          catatan: created?.catatan || "",
          tanaman_id: Number(id),
          foto_panen: created?.fotoFile || undefined,
        };

        const res = await FaseService.createPanen(payload);
        const saved = res?.data ?? res ?? payload;

        const rawDate =
          saved.TanggalPanenAktual ??
          saved.tanggal_panen_aktual ??
          saved.tanggalPanenAktual ??
          payload.tanggal_panen_aktual;

        let iso = "";
        if (rawDate) {
          const d = new Date(rawDate);
          if (!isNaN(d)) iso = d.toISOString().slice(0, 10);
        }

        const createdId = saved.ID ?? saved.id ?? Date.now();
        const view = {
          id: createdId,
          backend: saved,
          date: iso,
          jumlahPanen:
            saved.JumlahPanen ?? saved.jumlah_panen ?? payload.jumlah_panen,
          jumlahSampel:
            saved.JumlahSampel ?? saved.jumlah_sampel ?? payload.jumlah_sampel,
          beratTotal:
            saved.BeratTotal ?? saved.berat_total ?? payload.berat_total,
          catatan: saved.Catatan ?? saved.catatan ?? payload.catatan,
          fotoPanen: saved.FotoPanen ?? saved.foto_panen ?? "",
        };

        setPhases((prev) => {
          const exists = prev.panen.some((p) => p.id === createdId);
          const updated = exists
            ? prev.panen.map((p) => (p.id === createdId ? view : p))
            : [...prev.panen, view];

          return { ...prev, panen: updated };
        });
      } catch (err) {
        console.error("Gagal simpan fase panen:", err);
        alert("Gagal menyimpan fase panen");
      }
    },
    [id]
  );

  const handleSavePlant = useCallback(
    (data) => {
      const metaKey = `plant:${id}:meta`;
      const prevMeta = JSON.parse(localStorage.getItem(metaKey) || "{}");

      const raw = data?.data ?? data ?? {};

      const kodeTanaman =
        raw.KodeTanaman ?? raw.kode_tanaman ?? raw.code ?? plant?.code;
      const namaTanaman =
        raw.NamaTanaman ??
        raw.nama_tanaman ??
        raw.name ??
        plant?.name ??
        kodeTanaman;
      const kodeBlok = raw.KodeBlok ?? raw.kode_blok ?? plant?.block;
      const varietas = raw.Varietas ?? raw.varietas ?? plant?.varietas;
      const tanggalTanamIso =
        raw.TanggalTanam ??
        raw.tanggal_tanam ??
        raw.tanggalTanam ??
        raw.plantedIso ??
        plant?.plantedIso;
      const masaProduksi =
        raw.MasaProduksi ??
        raw.masa_produksi ??
        raw.masaProduksi ??
        raw.period ??
        plant?.periodDays;
      const foto = raw.FotoTanaman ?? raw.foto_tanaman ?? plant?.image;
      const kebunId =
        raw.KebunID ?? raw.kebun_id ?? raw.kebunId ?? plant?.kebunId;
      const health =
        raw.StatusKesehatan ??
        raw.status_kesehatan ??
        raw.health ??
        raw.Health ??
        plant?.health ??
        "Sehat";

      const plantedIso = tanggalTanamIso || null;
      const plantedDateObj = plantedIso ? new Date(plantedIso) : null;
      const periodDays = Number(masaProduksi || 0);
      const ageMonths = plantedIso ? monthsDiffFrom(plantedIso) : plant?.ageMonths || 0;

      setPlant((prev) => ({
        ...(prev || {}),
        id: raw.ID ?? raw.id ?? prev?.id ?? id,
        code: kodeTanaman || prev?.code || `Tanaman #${id}`,
        name: namaTanaman || prev?.name || prev?.code,
        block: kodeBlok || prev?.block,
        kebunId,
        varietas: varietas || prev?.varietas,
        plantedIso,
        periodDays,
        ageMonths,
        dateLabel: plantedDateObj ? fmtDMY(plantedDateObj) : prev?.dateLabel,
        health,
        image: foto || prev?.image || "/avocado1.png",
        diseaseHistory: prev?.diseaseHistory || [],
      }));

      const metaPayload = {
        ...prevMeta,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(metaKey, JSON.stringify(metaPayload));
    },
    [id, plant]
  );

  // ================================
  // RETURN FOR PlantDetail.jsx
  // ================================
  return {
    plant,
    loadingPlant,
    errorPlant,

    phases,
    loadingFaseBunga,
    loadingFaseBuah,
    loadingFasePanen,
    errorFaseBunga,
    errorFaseBuah,
    errorFasePanen,

    openFlowerModal,
    setOpenFlowerModal,
    openFruitModal,
    setOpenFruitModal,
    openPanenModal,
    setOpenPanenModal,
    openEditPlant,
    setOpenEditPlant,

    editingFlower,
    setEditingFlower,
    editingFruit,
    setEditingFruit,
    editingPanen,
    setEditingPanen,

    expandedPhase,
    setExpandedPhase,

    lineAreaRef,
    stepRefs,
    progressPx,

    safePlant,
    faseBerbuahData,

    handleSaveFlower,
    handleSaveFruit,
    handleSavePanen,
    handleSavePlant,
  };
}
