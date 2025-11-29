import { useEffect, useState } from "react";
import MonitoringService from "../services/MonitoringService";

export default function useMonitoring() {
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);

  // Ambil riwayat dari backend
  const loadHistory = async () => {
    try {
      const res = await MonitoringService.getHistory();
      setHistory(res);
    } catch (err) {
      console.error("❌ Error load history:", err);
    }
  };

  // Upload gambar → buka modal
  const handleImage = (e) => {
    const img = e.target.files[0];
    if (img) {
      setFile(img);
      setPreview(URL.createObjectURL(img));
      setModalOpen(true);
    }
  };

  // Kirim ke backend untuk klasifikasi
  const detectDisease = async () => {
    try {
      const res = await MonitoringService.classify(file);

      setAnalysis(res.data); // hasil analisis
      setModalOpen(false);

      // auto-refresh history setelah analisis
      loadHistory();
    } catch (err) {
      console.error("❌ Error classify:", err);
    }
  };

  // Simpan hasil analisis ke backend
  const saveToHistory = async () => {
    if (!analysis) return;

    const payload = {
      nama_penyakit: analysis.nama_penyakit,
      deskripsi: analysis.deskripsi,
      kondisi: analysis.kondisi,
      saran_perawatan: analysis.saran_perawatan,
    };

    try {
      await MonitoringService.saveLog(payload);
      loadHistory();
    } catch (err) {
      console.error("❌ Error save log:", err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return {
    preview,
    analysis,
    history,
    modalOpen,
    handleImage,
    detectDisease,
    saveToHistory,
    setModalOpen,
  };
}
