import { useEffect, useState, useCallback } from "react";
import MonitoringService from "../services/MonitoringService";

const normalizeHistory = (raw = {}) => {
  return {
    ...raw,
    id: raw.id ?? raw.ID ?? raw.log_id ?? raw.LogID ?? null,
    created_at: raw.created_at ?? raw.createdAt ?? raw.CreatedAt ?? "",
    nama_penyakit: raw.nama_penyakit ?? raw.penyakit?.nama_penyakit ?? "-",
    kondisi: raw.kondisi ?? raw.status ?? "-",
  };
};

export default function useMonitoring() {
  // UI states
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Upload & select
  const [file, setFile] = useState(null);
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");

  // History
  const [history, setHistory] = useState([]);

  // 1) Load daftar tanaman
  const loadPlants = useCallback(async () => {
    try {
      const data = await MonitoringService.getPlants();

      const normalized = (data || []).map((p) => {
        const id =
          p.ID ??
          p.id ??
          p.Id ??
          p.tanaman_id ??
          p.tanamanId ??
          null;

        const code =
          p.kode_tanaman ??
          p.KodeTanaman ??
          p.kode ??
          p.code ??
          `Tanaman-${id ?? ""}`;

        const name =
          p.nama_tanaman ??
          p.NamaTanaman ??
          p.nama ??
          p.name ??
          p.label ??
          code;

        const label =
          code && name && code !== name ? `${code} - ${name}` : name;

        return { id, code, label };
      });

      setPlants(normalized);

      // auto select first plant
      if (normalized.length > 0 && !selectedPlant && normalized[0].id) {
        setSelectedPlant(String(normalized[0].id));
      }
    } catch (err) {
      console.error("Error load plants:", err);
      setPlants([]);
    }
  }, [selectedPlant]);

  // 2) Load riwayat penyakit
  const loadHistory = useCallback(async () => {
    try {
      const data = await MonitoringService.getHistory();
      const normalized = (data || []).map(normalizeHistory);
      setHistory(normalized);
    } catch (err) {
      console.error("Error load history:", err);
    }
  }, []);

  // 3) Upload gambar
  const handleImage = (e) => {
    const img = e.target.files[0];
    if (!img) return;

    setFile(img);
    setPreview(URL.createObjectURL(img));
    setModalOpen(true);
  };

  // 4) Kirim foto ke AI deteksi penyakit
  const detectDisease = async () => {
    if (!selectedPlant) {
      alert("Pilih tanaman terlebih dahulu!");
      return;
    }
    if (!file) {
      alert("Pilih gambar dulu!");
      return;
    }

    try {
      const res = await MonitoringService.classify(file, selectedPlant);

      // Normalize saran_perawatan agar selalu array
      const rawSaran = res?.saran_perawatan;
      const saranPerawatan = Array.isArray(rawSaran)
        ? rawSaran
        : rawSaran
        ? [rawSaran]
        : [];

      setAnalysis({
        ...res,
        saran_perawatan: saranPerawatan,
      }); // backend return {nama_penyakit, deskripsi, ...}

      setModalOpen(false);
      loadHistory();

      setFile(null);
    } catch (err) {
      console.error("Error classify:", err);
      alert("Gagal mendeteksi penyakit.");
    }
  };

  // 5) Simpan hasil analisis ke Log Penyakit
  const saveToHistory = async () => {
    if (!analysis) return;

    const payload = {
      id_tanaman: selectedPlant,
      nama_penyakit: analysis.nama_penyakit,
      deskripsi: analysis.deskripsi,
      kondisi: analysis.kondisi,
      saran_perawatan: analysis.saran_perawatan,
    };

    try {
      await MonitoringService.saveLog(payload);

      loadHistory();

      setAnalysis(null);
      setPreview(null);
    } catch (err) {
      console.error("Error save log:", err);
      alert("Gagal menyimpan ke riwayat.");
    }
  };

  // INIT
  useEffect(() => {
    loadPlants();
    loadHistory();
  }, [loadPlants, loadHistory]);

  return {
    preview,
    analysis,
    history,
    modalOpen,

    plants,
    selectedPlant,
    setSelectedPlant,

    handleImage,
    detectDisease,
    saveToHistory,
    setModalOpen,
  };
}
