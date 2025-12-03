import { useCallback, useEffect, useState } from "react";
import TanamanService from "../services/TanamanService";
import { mapTanaman, monthsDiff, estimate } from "../helpers/plantUtils";

export default function useAllPlants() {
  const [plants, setPlants] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = null; // no pagination by default

  const loadPlants = useCallback(
    async (pageNow = 1) => {
      try {
        setLoading(true);
        setError(null);

        const res = await TanamanService.listAll(
          perPage ? pageNow : undefined,
          perPage ?? undefined
        );

        const mapped = (res.data ?? []).map((item) => {
          const base = mapTanaman(item);
          const harvestDate = "-"; // belum ada field panen aktual di response list
          const estPanen =
            base.date && base.period
              ? estimate(base.date, base.period)
              : "-";

          return {
            ...base,
            ageMonths: monthsDiff(base.date),
            phase: item.phase || item.fase || base.phase || "Fase Tumbuh",
            harvestDate,
            estimateDate: estPanen,
          };
        });

        setPlants(mapped);
        setMeta(res.meta ?? {});
      } catch (err) {
        console.error("Fetch all tanaman error:", err);
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Gagal memuat data tanaman";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    loadPlants(1);
  }, [loadPlants]);

  useEffect(() => {
    if (perPage) loadPlants(page);
  }, [page, perPage, loadPlants]);

  return {
    plants,
    meta,
    loading,
    error,
    page,
    perPage,
    setPage,
    reload: loadPlants,
  };
}
