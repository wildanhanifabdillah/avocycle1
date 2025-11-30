import useReport from "../hooks/useReport";

export default function Report() {
  const {
    logs,
    meta,
    selected,
    loading,
    page,
    setPage,
    setSelected,
    loadDetail
  } = useReport();

  // Format tanggal
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d)) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${d.getFullYear()}`;
  };

  // ====================== DETAIL VIEW ======================
  if (selected) {
    const status = selected.kondisi === "Sembuh" ? "Sehat" : "Sakit";

    return (
      <div className="px-6 py-6 space-y-6">

        {/* Gambar */}
        <div className="w-full h-64 rounded-xl overflow-hidden shadow border border-green-300 bg-gray-100">
          <img src={selected.foto} className="w-full h-full object-cover" />
        </div>

        {/* Judul */}
        <h2 className="text-xl font-bold text-gray-800">
          Hasil Analisis Tanggal {formatDate(selected.created_at)}
        </h2>

        {/* Deskripsi */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-green-300">
          <p className="font-semibold text-lg">
            Penyakit: {selected.penyakit.nama_penyakit}
          </p>

          <p className="mt-4"><b>Deskripsi:</b> {selected.penyakit.deskripsi}</p>
          <p className="mt-2"><b>Catatan:</b> {selected.catatan}</p>

          <p className="mt-4 font-semibold">Saran Perawatan:</p>
          <div className="mt-3 bg-green-100 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-line">
            {selected.saran_perawatan}
          </div>
        </div>

        {/* Riwayat Lain */}
        <div className="bg-white rounded-xl border border-green-300 shadow-md p-6">
          <p className="text-lg font-semibold mb-4">Riwayat Deteksi</p>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="pb-2">Tanggal</th>
                <th className="pb-2">Kode Pohon</th>
                <th className="pb-2">Penyakit</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2">{formatDate(selected.created_at)}</td>
                <td className="py-2">{selected.tanaman.kode_tanaman}</td>
                <td className="py-2">{selected.penyakit.nama_penyakit}</td>
                <td className="py-2 text-green-700 font-semibold">{status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={() => setSelected(null)}
          className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-green-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  // ====================== LIST VIEW ======================
  return (
    <div className="px-6 py-6 space-y-10">
      <h2 className="text-xl font-bold text-gray-800">Riwayat Deteksi</h2>

      {loading && <p>Loading...</p>}

      {logs.map((item) => {
        const status = item.kondisi === "Sembuh" ? "Sehat" : "Sakit";

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-green-500 shadow-md p-5 flex items-center gap-5 hover:shadow-lg transition"
          >
            {/* Gambar */}
            <div className="w-24 h-24 rounded-xl overflow-hidden border bg-gray-200">
              <img src={item.foto} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="font-bold text-lg">{item.tanaman.kode_tanaman}</p>
              <p className="text-gray-700 text-sm">
                Jenis: {item.tanaman.nama_tanaman}
              </p>
              <p className="text-sm">
                Penyakit: {item.penyakit.nama_penyakit}
              </p>
              <p className="text-sm text-gray-500">
                Tanggal cek: {formatDate(item.created_at)}
              </p>
              <p className="text-sm text-red-600 font-semibold">{status}</p>
            </div>

            {/* Tombol Detail */}
            <button
              onClick={() => loadDetail(item.id)}
              className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700"
            >
              Lihat Detail
            </button>
          </div>
        );
      })}

      {/* Pagination */}
      <div className="w-full flex justify-center items-center gap-4 text-gray-700 select-none">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded hover:bg-green-200"
        >
          &lt;
        </button>

        <span className="px-3 py-1 bg-green-600 text-white rounded-md shadow">
          {page}
        </span>

        <button
          disabled={page >= meta.total_pages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded hover:bg-green-200"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
