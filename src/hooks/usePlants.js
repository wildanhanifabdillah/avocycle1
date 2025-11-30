import { useCallback, useEffect, useState } from "react";
import TanamanService from "../services/TanamanService";
import { mapTanaman } from "../helpers/plantUtils";

export default function usePlants(kebunId) {
  const [plants, setPlants] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = null; // biarkan backend tanpa query pagination jika tidak didukung

  const loadPlants = useCallback(
    async (pageNow = 1) => {
      try {
        setLoading(true);
        setError(null);

        const res = await TanamanService.listByKebun(
          kebunId,
          perPage ? pageNow : undefined,
          perPage ?? undefined
        );

        setPlants((res.data ?? []).map(mapTanaman));
        setMeta(res.meta ?? {});
      } catch (err) {
        console.error("Fetch tanaman error:", err);
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Gagal memuat data tanaman";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [kebunId, perPage]
  );

  const deletePlant = async (id) => {
    await TanamanService.remove(id);
    await loadPlants(page);
  };

  useEffect(() => {
    if (kebunId) loadPlants(1);
  }, [kebunId, loadPlants]);

  useEffect(() => {
    if (kebunId && perPage) loadPlants(page);
  }, [page, kebunId, perPage, loadPlants]);

  return {
    plants,
    meta,
    loading,
    error,
    page,
    perPage,
    setPage,
    reload: loadPlants,
    deletePlant,
  };
}
