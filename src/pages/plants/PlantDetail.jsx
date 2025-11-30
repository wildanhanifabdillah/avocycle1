import { useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditFaseBerbungaModal from "./modals/EditFaseBerbungaModal";
import EditFaseBerbuahModal from "./modals/EditFaseBerbuahModal";
import EditFasePanenModal from "./modals/EditFasePanenModal";
import EditPlantModal from "./modals/EditPlantModal";

export default function PlantDetail() {
  const { id } = useParams();

  const [plant, setPlant] = useState(null);
  const [loadingPlant, setLoadingPlant] = useState(false);
  const [errorPlant, setErrorPlant] = useState(null);

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

  const [openFlowerModal, setOpenFlowerModal] = useState(false);
  const [openFruitModal, setOpenFruitModal] = useState(false);
  const [openPanenModal, setOpenPanenModal] = useState(false);
  const [openEditPlant, setOpenEditPlant] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState(null);

  const [editingFlower, setEditingFlower] = useState(null);
  const [editingFruit, setEditingFruit] = useState(null);
  const [editingPanen, setEditingPanen] = useState(null);

  const lineAreaRef = useRef(null);
  const stepRefs = useRef([]);
  const [progressPx, setProgressPx] = useState(0);

  const parseDMY = (str) => {
    const [d, m, y] = (str || "").split("/");
    if (!d || !m || !y) return null;
    const year = y.length === 2 ? 2000 + Number(y) : Number(y);
    const date = new Date(year, Number(m) - 1, Number(d));
    return isNaN(date.getTime()) ? null : date;
  };

  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const fmtDMY = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const toYMD = (value) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [d, m, y] = value.split("/");
      return `${y}-${m}-${d}`;
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  const monthsDiffFromIso = (iso) => {
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

  // ========== FETCH TANAMAN ==========
  useEffect(() => {
    const fetchPlant = async () => {
      if (!id) return;

      setLoadingPlant(true);
      setErrorPlant(null);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:2005/api/v1/tanaman/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) throw new Error("Gagal mengambil data tanaman");

        const json = await res.json();
        const raw = json.data || {};

        const kodeTanaman = raw.KodeTanaman ?? raw.kode_tanaman;
        const varietas = raw.Varietas ?? raw.varietas;
        const tanggalTanamIso =
          raw.TanggalTanam ?? raw.tanggal_tanam ?? raw.tanggalTanam;
        const masaProduksi =
          raw.MasaProduksi ?? raw.masa_produksi ?? raw.masaProduksi;
        const foto = raw.FotoTanaman ?? raw.foto_tanaman;

        let meta = null;
        try {
          const metaRaw = localStorage.getItem(`plant:${id}:meta`);
          meta = metaRaw ? JSON.parse(metaRaw) : null;
        } catch {}

        const plantedIso = meta?.date || tanggalTanamIso || null;
        const periodDays = Number(meta?.period || masaProduksi || 0);
        const plantedDateObj = plantedIso ? new Date(plantedIso) : null;
        const ageMonths = plantedDateObj ? monthsDiffFromIso(plantedIso) : 0;

        const plantView = {
          id: raw.ID ?? raw.id ?? id,
          code: meta?.code || kodeTanaman || `Tanaman #${id}`,
          varietas,
          plantedIso,
          periodDays,
          ageMonths,
          dateLabel: plantedDateObj ? fmtDMY(plantedDateObj) : "-",
          health: "Sehat",
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

          diseaseHistory: [
            {
              date: "15/09/2025",
              component: kodeTanaman,
              disease: "Antraknosa",
              status: "Belum dirawat",
            },
          ],
        };

        setPlant(plantView);
      } catch (err) {
        setErrorPlant(err.message || "Terjadi kesalahan");
      } finally {
        setLoadingPlant(false);
      }
    };

    fetchPlant();
  }, [id]);

  // ========== FETCH FASE BERBUNGA ==========
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
        const list = (json.data || []).map((fb) => ({
          id: fb.ID ?? fb.id,
          backend: fb,
          date: toYMD(fb.tanggal_catat ?? fb.TanggalCatat),
          munculBunga: fb.jumlah_bunga ?? fb.JumlahBunga,
          pecahBunga: fb.bunga_pecah ?? fb.BungaPecah,
          pentilPertama: fb.pentil_muncul ?? fb.PentilMuncul,
        }));

        setPhases((prev) => ({ ...prev, berbunga: list }));
      } catch (err) {
        setErrorFaseBunga(err.message);
      } finally {
        setLoadingFaseBunga(false);
      }
    };

    fetchFaseBunga();
  }, [id]);

  // ========== FETCH FASE BERBUAH ==========
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
          const tanggalCover =
            fb.TanggalCover ?? fb.tanggal_cover ?? fb.tanggalCover;
          const estimasiPanen =
            fb.EstimasiPanen ?? fb.estimasi_panen ?? fb.estimasiPanen;
          const warna = fb.WarnaLabel ?? fb.warna_label ?? fb.warnaLabel;

          return {
            id: fb.ID ?? fb.id,
            backend: fb,
            date: toYMD(tanggalCover),
            cover: fb.JumlahCover ?? fb.jumlah_cover ?? fb.jumlahCover,
            labelColor: warna || "red",
            estimasi: estimasiPanen ? fmtDMY(new Date(estimasiPanen)) : "",
          };
        });

        setPhases((prev) => ({ ...prev, berbuah: list }));
      } catch (err) {
        setErrorFaseBuah(err.message);
      } finally {
        setLoadingFaseBuah(false);
      }
    };

    fetchFaseBuah();
  }, [id]);

  // ========== FETCH FASE PANEN ==========
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

          let displayDate = "";
          if (rawDate) {
            const d = new Date(rawDate);
            if (!isNaN(d.getTime())) {
              displayDate = d.toISOString().split("T")[0];
            }
          }

          return {
            id: fp.ID ?? fp.id,
            backend: fp,
            date: displayDate,
            jumlahPanen: fp.JumlahPanen ?? fp.jumlah_panen,
            jumlahSampel: fp.JumlahSampel ?? fp.jumlah_sampel,
            beratTotal: fp.BeratTotal ?? fp.berat_total,
            catatan: fp.Catatan ?? fp.catatan,
            fotoPanen: fp.FotoPanen ?? fp.foto_panen,
          };
        });

        setPhases((prev) => ({ ...prev, panen: list }));
      } catch (err) {
        setErrorFasePanen(err.message);
      } finally {
        setLoadingFasePanen(false);
      }
    };

    fetchFasePanen();
  }, [id]);

  // ========== STEP / TIMELINE ==========
  const step1Done = phases.berbunga.length > 0;
  const step2Done = phases.berbuah.length > 0;

  const latestEstimasi = useMemo(() => {
    if (!phases.berbuah.length) return null;
    const last = phases.berbuah[phases.berbuah.length - 1];
    if (!last.estimasi) return null;

    const [d, m, y] = last.estimasi.split("/");
    const year = y.length === 2 ? 2000 + Number(y) : Number(y);
    return new Date(year, Number(m) - 1, Number(d));
  }, [phases.berbuah]);

  const step3Done = latestEstimasi && new Date() >= latestEstimasi;
  const lastReached = step3Done ? 2 : step2Done ? 1 : step1Done ? 0 : -1;

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

  const safePlant =
    plant || {
      id,
      code: `Tanaman #${id}`,
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

  // ========== RENDER ==========
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src={safePlant.image}
            alt={safePlant.code}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{safePlant.code}</h2>
            <p className="text-sm text-gray-600">
              Tanggal Tanam: {safePlant.dateLabel}
            </p>
            <p className="text-sm text-gray-600">
              Usia: {safePlant.ageMonths} bulan
            </p>
            <p className="text-sm text-gray-600">
              Status Kesehatan:{" "}
              <span className="text-green-700 font-medium">
                {safePlant.health}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenEditPlant(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow"
        >
          <FaEdit /> Edit Data
        </button>
      </div>

      {/* Siklus Pertumbuhan */}
      <div className="bg-white rounded-xl shadow-md p-6 border">
        <h3 className="font-semibold mb-4 text-gray-700">Siklus Pertumbuhan</h3>
        <div className="relative">
          <div ref={lineAreaRef} className="absolute left-8 right-8 top-4">
            <div className="h-[2px] bg-gray-300 w-full" />
            <div
              className="h-[2px] bg-green-500"
              style={{ width: `${progressPx}px` }}
            />
          </div>
          <ol className="flex justify-between">
            {safePlant.stages.map((s, i) => {
              const circleClass = (() => {
                if (i === 0) {
                  return step1Done ? "bg-green-600" : "bg-gray-400";
                }
                if (i === 1) {
                  if (step2Done) return "bg-green-600";
                  if (step1Done) return "bg-black"; // current step
                  return "bg-gray-400";
                }
                if (i === 2) {
                  if (step3Done) return "bg-green-600";
                  if (step2Done) return "bg-black"; // current step
                  return "bg-gray-400";
                }
                return "bg-gray-400";
              })();
              return (
                <li key={s.id} className="flex flex-col items-center">
                  <div
                    ref={(el) => (stepRefs.current[i] = el)}
                    className={`relative z-10 w-10 h-10 rounded-full ${circleClass} text-white flex items-center justify-center font-semibold shadow`}
                  >
                    {s.id}
                  </div>
                  <p className="mt-3 text-sm text-gray-700">{s.name}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* FASE */}
      <div className="bg-white rounded-xl shadow-md p-6 border">
        <h3 className="font-semibold mb-4 text-gray-700">
          Riwayat Siklus Pertumbuhan
        </h3>

        <div className="space-y-3">
          {/* FASE 1 - BERBUNGA */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div
                className="cursor-pointer"
                onClick={() =>
                  setExpandedPhase(
                    expandedPhase === "berbunga" ? null : "berbunga"
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 border">
                    Fase 1
                  </span>
                  <span className="font-semibold text-gray-800">
                    Fase Berbunga
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Silakan isi saat pohon muncul bunga
                </p>
              </div>

              <button
                className="p-2 rounded-lg border text-gray-400 hover:text-gray-600 flex items-center gap-1"
                onClick={() => {
                  setEditingFlower(null);
                  setOpenFlowerModal(true);
                }}
              >
                <FaEdit />
                <span className="text-xs">Tambah</span>
              </button>
            </div>

            {expandedPhase === "berbunga" && (
              <div className="mt-4 overflow-x-auto">
                {loadingFaseBunga ? (
                  <p className="italic text-sm">Memuat data…</p>
                ) : errorFaseBunga ? (
                  <p className="text-sm text-red-600">{errorFaseBunga}</p>
                ) : phases.berbunga.length === 0 ? (
                  <p className="italic text-sm">Belum ada data.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="py-2 px-3">Tanggal</th>
                        <th className="py-2 px-3">Muncul Bunga</th>
                        <th className="py-2 px-3">Pecah Bunga</th>
                        <th className="py-2 px-3">Pentil Pertama</th>
                        <th className="py-2 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phases.berbunga.map((r, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-3 px-3 text-center">{r.date}</td>
                          <td className="py-3 px-3 text-center">
                            {r.munculBunga}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {r.pecahBunga}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {r.pentilPertama}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              className="px-2 py-1 text-xs border rounded hover:bg-gray-50 flex items-center gap-1 mx-auto"
                              onClick={() => {
                                setEditingFlower(r);
                                setOpenFlowerModal(true);
                              }}
                            >
                              <FaEdit className="inline-block" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* FASE 2 - BERBUAH */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div
                className="cursor-pointer"
                onClick={() =>
                  setExpandedPhase(
                    expandedPhase === "berbuah" ? null : "berbuah"
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 border">
                    Fase 2
                  </span>
                  <span className="font-semibold text-gray-800">
                    Fase Berbuah
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Silakan isi saat pohon muncul buah
                </p>
              </div>

              <button
                className="p-2 rounded-lg border text-gray-400 hover:text-gray-600 flex items-center gap-1"
                onClick={() => {
                  setEditingFruit(null);
                  setOpenFruitModal(true);
                }}
              >
                <FaEdit />
                <span className="text-xs">Tambah</span>
              </button>
            </div>

            {expandedPhase === "berbuah" && (
              <div className="mt-4 overflow-x-auto">
                {loadingFaseBuah ? (
                  <p className="italic text-sm">Memuat data…</p>
                ) : errorFaseBuah ? (
                  <p className="text-sm text-red-600">{errorFaseBuah}</p>
                ) : phases.berbuah.length === 0 ? (
                  <p className="italic text-sm">Belum ada data.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="py-2 px-3">Tanggal Cover</th>
                        <th className="py-2 px-3">Jumlah Cover</th>
                        <th className="py-2 px-3">Warna Label</th>
                        <th className="py-2 px-3">Estimasi Panen</th>
                        <th className="py-2 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phases.berbuah.map((row, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-3 px-3 text-center">{row.date}</td>
                          <td className="py-3 px-3 text-center">{row.cover}</td>
                          <td className="py-3 px-3 text-center">{row.labelColor}</td>
                          <td className="py-3 px-3 text-center">{row.estimasi}</td>
                          <td className="py-3 px-3 text-center">
                            <button
                              className="px-2 py-1 text-xs border rounded hover:bg-gray-50 flex items-center gap-1 mx-auto"
                              onClick={() => {
                                setEditingFruit(row);
                                setOpenFruitModal(true);
                              }}
                            >
                              <FaEdit className="inline-block" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* FASE 3 - PANEN */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div
                className="cursor-pointer"
                onClick={() =>
                  setExpandedPhase(
                    expandedPhase === "panen" ? null : "panen"
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 border">
                    Fase 3
                  </span>
                  <span className="font-semibold text-gray-800">
                    Fase Panen
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Catat hasil panen aktual (jumlah, sampel, berat, foto)
                </p>
              </div>

              <button
                className="p-2 rounded-lg border text-gray-400 hover:text-gray-600 flex items-center gap-1"
                onClick={() => {
                  setEditingPanen(null);
                  setOpenPanenModal(true);
                }}
              >
                <FaEdit />
                <span className="text-xs">Tambah</span>
              </button>
            </div>

            {expandedPhase === "panen" && (
              <div className="mt-4 overflow-x-auto">
                {loadingFasePanen ? (
                  <p className="italic text-sm">Memuat data…</p>
                ) : errorFasePanen ? (
                  <p className="text-sm text-red-600">{errorFasePanen}</p>
                ) : phases.panen.length === 0 ? (
                  <p className="italic text-sm">Belum ada data.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-700">
                        <th className="py-2 px-3 text-center">Tanggal Panen</th>
                        <th className="py-2 px-3 text-center">Jumlah Panen</th>
                        <th className="py-2 px-3 text-center">Catatan</th>
                        <th className="py-2 px-3 text-center">Foto</th>
                        <th className="py-2 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phases.panen.map((row, i) => (
                        <tr key={i} className="border-t border-gray-300">
                          <td className="py-3 text-center">{row.date || "-"}</td>
                          <td className="py-3 text-center">
                            {row.jumlahPanen ?? "-"}
                          </td>
                          <td className="py-3 text-center">
                            {row.catatan || "-"}
                          </td>
                          <td className="py-3 text-center">
                            {row.fotoPanen ? (
                              <a
                                href={row.fotoPanen}
                                target="_blank"
                                rel="noreferrer"
                                className="underline text-green-700 text-xs"
                              >
                                Lihat
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Tidak ada
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              className="px-2 py-1 text-xs border rounded hover:bg-gray-50 flex items-center gap-1 mx-auto"
                              onClick={() => {
                                setEditingPanen(row);
                                setOpenPanenModal(true);
                              }}
                            >
                              <FaEdit className="inline-block" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIWAYAT PENYAKIT */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold mb-4 text-gray-700">Riwayat Penyakit</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Komponen</th>
              <th>Penyakit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {safePlant.diseaseHistory.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="py-3">{row.date}</td>
                <td>{row.component}</td>
                <td>{row.disease}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FASE BERBUNGA */}
      <EditFaseBerbungaModal
        open={openFlowerModal}
        onClose={() => {
          setOpenFlowerModal(false);
          setEditingFlower(null);
        }}
        plantId={safePlant.id}
        initialData={editingFlower}
        onSave={(created) => {
          const createdId = created.ID ?? created.id;
          const rawDate =
            created.TanggalCatat ??
            created.tanggal_catat ??
            created.tanggalCatat;

          const payload = {
            id: createdId,
            backend: created,
            date: toYMD(rawDate),
            munculBunga: created.JumlahBunga ?? created.jumlah_bunga,
            pecahBunga: created.BungaPecah ?? created.bunga_pecah,
            pentilPertama: created.PentilMuncul ?? created.pentil_muncul,
          };

          setPhases((prev) => {
            const exists = prev.berbunga.some((b) => b.id === createdId);
            const updatedBerbunga = exists
              ? prev.berbunga.map((b) => (b.id === createdId ? payload : b))
              : [...prev.berbunga, payload];

            return { ...prev, berbunga: updatedBerbunga };
          });

          setEditingFlower(null);
        }}
      />

      {/* MODAL FASE BERBUAH */}
      <EditFaseBerbuahModal
        open={openFruitModal}
        onClose={() => {
          setOpenFruitModal(false);
          setEditingFruit(null);
        }}
        initialData={editingFruit}
        plantId={safePlant.id}
        onSave={(created) => {
          const createdId = created.ID ?? created.id;

          const tanggalCover =
            created.TanggalCover ??
            created.tanggal_cover ??
            created.tanggalCover;

          const estimasiPanen =
            created.EstimasiPanen ??
            created.estimasi_panen ??
            created.estimasiPanen;

          const warna =
            created.WarnaLabel ??
            created.warna_label ??
            created.warnaLabel;

          const payload = {
            id: createdId,
            backend: created,
            date: toYMD(tanggalCover),
            cover: created.JumlahCover ?? created.jumlah_cover,
            labelColor: warna || "red",
            estimasi: estimasiPanen ? fmtDMY(new Date(estimasiPanen)) : "",
          };

          setPhases((prev) => {
            const exists = prev.berbuah.some((b) => b.id === createdId);
            const updatedBerbuah = exists
              ? prev.berbuah.map((b) => (b.id === createdId ? payload : b))
              : [...prev.berbuah, payload];

            return { ...prev, berbuah: updatedBerbuah };
          });
        }}
      />

      {/* MODAL FASE PANEN */}
      <EditFasePanenModal
        open={openPanenModal}
        onClose={() => {
          setOpenPanenModal(false);
          setEditingPanen(null);
        }}
        plantId={safePlant.id}
        initialData={editingPanen}
        onSave={(created) => {
          const createdId = created.ID ?? created.id;
          const rawDate =
            created.TanggalPanenAktual ??
            created.tanggal_panen_aktual ??
            created.tanggalPanenAktual;

          let displayDate = "";
          if (rawDate) {
            const d = new Date(rawDate);
            if (!isNaN(d.getTime())) {
              displayDate = d.toISOString().split("T")[0];
            }
          }

          const payload = {
            id: createdId,
            backend: created,
            date: displayDate,
            jumlahPanen: created.JumlahPanen ?? created.jumlah_panen,
            jumlahSampel: created.JumlahSampel ?? created.jumlah_sampel,
            beratTotal: created.BeratTotal ?? created.berat_total,
            catatan: created.Catatan ?? created.catatan,
            fotoPanen: created.FotoPanen ?? created.foto_panen,
          };

          setPhases((prev) => {
            const exists = prev.panen.some((p) => p.id === createdId);
            const updatedPanen = exists
              ? prev.panen.map((p) => (p.id === createdId ? payload : p))
              : [...prev.panen, payload];

            return { ...prev, panen: updatedPanen };
          });
        }}
      />

      {/* MODAL EDIT PLANT */}
      {openEditPlant && (
        <EditPlantModal
          onClose={() => setOpenEditPlant(false)}
          initialData={{
            type: plant?.varietas || "",
            date: plant?.plantedIso || "",
            period: plant?.periodDays || "",
            code: plant?.code || "",
          }}
          onSave={(data) => {
            const metaKey = `plant:${id}:meta`;
            const prev = JSON.parse(localStorage.getItem(metaKey) || "{}");
            const payload = {
              ...prev,
              ...data,
              updatedAt: new Date().toISOString(),
            };
            localStorage.setItem(metaKey, JSON.stringify(payload));
          }}
        />
      )}
    </div>
  );
}
