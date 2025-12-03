import { Link } from "react-router-dom";
import useAllPlants from "../hooks/useAllPlants";
import { monthsDiff, estimate, healthClass } from "../helpers/plantUtils";

export default function PlantPembeli() {
  const { plants, loading, error } = useAllPlants();

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Tanaman Tersedia</h1>
          <p className="text-sm text-gray-600">
            Daftar seluruh pohon yang tersedia.
          </p>
        </div>
      </div>

      {/* STATE */}
      {loading && <p className="text-gray-500">Memuat data tanaman...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && plants.length === 0 && (
        <p className="text-gray-600">Belum ada data tanaman.</p>
      )}

      {/* LIST CARD */}
      <div className="flex flex-col gap-4">
        {plants.map((p) => (
          <div
            key={p.id}
            className="relative bg-white border-t-4 border-green-400 rounded-xl shadow-md hover:shadow-lg transition p-4 max-w-5xl w-full mx-auto"
          >
            {/* GRID CARD - sama seperti Plants.jsx */}
            <div className="flex gap-4 items-start">
              {/* FOTO */}
              <img
                src={p.image}
                alt={p.code}
                className="w-28 h-28 object-cover rounded-lg"
              />

              {/* DETAIL */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{p.code}</h2>

                  {/* HEALTH BADGE */}
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${healthClass(
                      p.health
                    )}`}
                  >
                    {p.health}
                  </span>
                </div>

                <div className="text-sm text-gray-600 flex gap-6 mt-1">
                  <span className="flex gap-2 items-center">
                    <img src="/icons/calendar.svg" className="w-4 h-4" />{" "}
                    {monthsDiff(p.date)} bulan
                  </span>
                  <span className="flex gap-2 items-center">
                    <img src="/icons/growth.svg" className="w-4 h-4" />{" "}
                    {p.phase}
                  </span>
                </div>

                <div className="mt-1 text-sm text-gray-700">
                  <p>
                    Jenis:{" "}
                    {p.type === "mentega"
                      ? "Alpukat Mentega"
                      : p.type === "miki"
                      ? "Alpukat Miki"
                      : "-"}
                  </p>
                  <p>Tanggal tanam: {p.fmtDate}</p>
                  <p>Estimasi panen: {estimate(p.date, p.period)}</p>
                </div>
              </div>

              {/* BUTTON — sama posisi dengan Plants.jsx */}
              <div className="self-end">
                <Link
                  to={`/plants/${p.id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow text-sm"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
