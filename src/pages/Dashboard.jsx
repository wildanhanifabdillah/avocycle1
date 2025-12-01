import { useEffect, useState } from "react";
import { FaLeaf, FaExclamationTriangle, FaSeedling } from "react-icons/fa";
import CardStat from "../components/CardStat";
import DonutChart from "../components/DonutChart";
import BarChart from "../components/BarChart";
import DashboardService from "../services/DashboardService";

const normalizeCount = (val) => {
  if (!val && val !== 0) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "string" && !Number.isNaN(Number(val))) return Number(val);
  if (typeof val === "object") {
    return (
      val.count ?? val.total ?? val.data ?? val.value ?? val.Count ?? val.Total ?? 0
    );
  }
  return 0;
};

const normalizeWeeklyPanen = (raw) => {
  if (Array.isArray(raw)) {
    return raw.map((item, idx) => {
      const jumlahRaw =
        item.jumlah ??
        item.total ??
        item.count ??
        item.qty ??
        item.Jumlah ??
        0;
      const jumlah = Number(jumlahRaw) || 0;
      const name =
        item.minggu_label ||
        item.week_label ||
        item.minggu ||
        item.week ||
        item.label ||
        `Minggu ${idx + 1}`;
      return { name, jumlah };
    });
  }

  // Handle { labels: [], data: [] }
  if (raw && Array.isArray(raw.labels) && Array.isArray(raw.data)) {
    return raw.labels.map((label, idx) => ({
      name: label || `Minggu ${idx + 1}`,
      jumlah: Number(raw.data[idx]) || 0,
    }));
  }

  return [];
};

export default function Dashboard() {
  const [countPohon, setCountPohon] = useState(0);
  const [countSakit, setCountSakit] = useState(0);
  const [countSiapPanen, setCountSiapPanen] = useState(0);
  const [panenData, setPanenData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pohon, sakit, siapPanen, panen] = await Promise.all([
          DashboardService.getCountPohon(),
          DashboardService.getCountSakit(),
          DashboardService.getCountSiapPanen(),
          DashboardService.getWeeklyPanen(),
        ]);

        setCountPohon(normalizeCount(pohon));
        setCountSakit(normalizeCount(sakit));
        setCountSiapPanen(normalizeCount(siapPanen));
        setPanenData(normalizeWeeklyPanen(panen));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setCountPohon(0);
        setCountSakit(0);
        setCountSiapPanen(0);
        setPanenData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const healthyCount = Math.max(countPohon - countSakit, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardStat
          icon={<FaLeaf className="text-green-600" />}
          value={loading ? "..." : countPohon}
          label="Total Pohon"
          color="border-green-400"
        />
        <CardStat
          icon={<FaExclamationTriangle className="text-red-500" />}
          value={loading ? "..." : countSakit}
          label="Pohon Sakit"
          color="border-red-400"
        />
        <CardStat
          icon={<FaSeedling className="text-blue-600" />}
          value={loading ? "..." : countSiapPanen}
          label="Siap Panen"
          color="border-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DonutChart healthy={healthyCount} sick={countSakit} />
        <BarChart data={panenData} />
      </div>
    </div>
  );
}
