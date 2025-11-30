import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMountain, FaLeaf } from "react-icons/fa";

export default function Kebun() {
  const [kebunList, setKebunList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 3; // jumlah kebun per halaman

  const fetchKebun = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:2005/api/v1/kebun?page=${currentPage}&per_page=${pageSize}`
      );
      if (!res.ok) throw new Error("Gagal mengambil data kebun");

      const json = await res.json();
      console.log("Fetched kebun:", json.data);

      const mapped = (json.data || []).map((k) => ({
        id: k.ID,
        name: k.nama_kebun,
        mdpl: k.mdpl, // kalau ada di struct
      }));

      setKebunList(mapped);
      setTotalPages(json.meta?.total_pages || 1);
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKebun(page);
  }, [page]);

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <div className="relative">
      {/* Status */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600 text-sm">Error: {error}</p>}

      {/* Daftar kebun */}
      <div className="flex flex-col gap-4">
        {kebunList.map((k) => (
          <div
            key={k.id}
            className="bg-white border-t-4 border-green-400 rounded-xl shadow-md flex justify-between items-stretch p-4 hover:shadow-lg transition max-w-4xl w-full mx-auto h-32"
          >
            {/* Kiri: info kebun */}
            <div className="flex items-stretch gap-4 h-full w-2/3">
              <div className="w-[92px] h-[92px] rounded-full bg-green-100 flex items-center justify-center">
                <FaMountain className="text-green-700 text-2xl" />
              </div>

              <div className="flex flex-col justify-center w-4/5">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{k.name}</h2>
                  <span className="px-3 py-0.5 rounded-full text-xs font-medium border border-green-500 text-green-700 bg-green-50 inline-flex items-center gap-1">
                    <FaLeaf className="text-green-600" />
                    Kebun
                  </span>
                </div>

                <div className="mt-1 text-sm text-gray-700">
                  <p>
                    MDPL:{" "}
                    <span className="font-medium">
                      {k.mdpl ? `${k.mdpl} mdpl` : "-"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Kanan: tombol */}
            <div className="flex flex-col items-end justify-center">
              <Link
                to={`/kebun/${k.id}/plants`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow text-sm"
              >
                Lihat Tanaman
              </Link>
            </div>
          </div>
        ))}

        {kebunList.length === 0 && !loading && !error && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Belum ada data kebun.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          className="px-2 py-1 text-gray-700 hover:text-green-700 disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          {"<"}
        </button>

        {Array.from({ length: totalPages }).slice(0, 3).map((_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`h-8 w-8 rounded-full border text-sm ${
                page === n
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-300 text-gray-700 hover:border-green-500"
              }`}
            >
              {n}
            </button>
          );
        })}

        {totalPages > 3 && (
          <span className="px-1 text-gray-500 text-sm">…</span>
        )}

        <button
          className="px-2 py-1 text-gray-700 hover:text-green-700 disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
