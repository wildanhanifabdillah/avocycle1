import { useEffect, useState } from "react";
import LogPenyakitService from "../services/LogPenyakitService";

const normalizeLog = (raw = {}) => {
  const tanaman = raw.tanaman || {};
  const penyakit = raw.penyakit || {};
  const createdAt = raw.created_at ?? raw.createdAt ?? raw.CreatedAt ?? "";

  return {
    ...raw,
    id: raw.id ?? raw.ID ?? raw.log_id ?? raw.LogID ?? null,
    created_at: createdAt,
    tanaman: {
      ...tanaman,
      kode_tanaman:
        tanaman.kode_tanaman ??
        tanaman.KodeTanaman ??
        tanaman.code ??
        tanaman.nama ??
        "",
      nama_tanaman: tanaman.nama_tanaman ?? tanaman.NamaTanaman ?? tanaman.nama,
    },
    penyakit,
  };
};

export default function useReport() {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const perPage = 5;

  // ================== LOAD DETAIL ==================
  const loadDetail = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await LogPenyakitService.getLogDetail(id);
      setSelected(res);
    } catch (err) {
      console.error("Error detail log:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================== LOAD LIST ==================
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await LogPenyakitService.getAllLogs(page, perPage);
        const normalized = (res.data || []).map(normalizeLog);
        setLogs(normalized);
        setMeta(res.meta || {});
      } catch (err) {
        console.error("Error load logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page, perPage]);

  return {
    logs,
    meta,
    selected,
    loading,
    page,
    setPage,
    setSelected,
    loadDetail,
  };
}
