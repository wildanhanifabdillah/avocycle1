import useMonitoring from "../hooks/useMonitoring";

export default function Monitoring() {
  const {
    preview,
    analysis,
    history,
    modalOpen,
    handleImage,
    detectDisease,
    saveToHistory,
    setModalOpen,
  } = useMonitoring();

  return (
    <div className="p-6 space-y-6">
      {/* Upload */}
      <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Input Foto Pohon</h2>
          <label className="border rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100">
            <input type="file" className="hidden" onChange={handleImage} />
            <div className="text-center text-gray-600">
              <p className="text-lg">📁</p>
              <p>Input Foto</p>
            </div>
          </label>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Hasil Input Foto</h2>
          <div className="border rounded-xl h-40 flex items-center justify-center bg-gray-50 overflow-hidden">
            {preview ? (
              <img src={preview} className="h-full object-contain" />
            ) : (
              <p className="text-gray-400">Belum ada gambar</p>
            )}
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Hasil Analisis</h3>

        {analysis ? (
          <div className="bg-green-50 border border-green-300 rounded-xl p-4">
            <p className="font-semibold text-green-700 mb-2">
              Penyakit: {analysis.nama_penyakit}
            </p>

            <p className="mb-2"><b>Deskripsi:</b> {analysis.deskripsi}</p>
            <p className="mb-2"><b>Kondisi:</b> {analysis.kondisi}</p>

            <p className="font-semibold">Saran Perawatan:</p>
            <ul className="list-disc ml-6 text-sm space-y-1">
              {analysis.saran_perawatan.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400">Belum ada analisis</p>
        )}
      </div>

      {/* History */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-gray-700 mb-4">
          Riwayat Deteksi Penyakit
        </h3>

        <div className="border rounded-xl p-4 bg-green-50">
          <div className="grid grid-cols-4 font-semibold text-gray-600 border-b pb-2 mb-2 text-sm">
            <p>Tanggal</p>
            <p>Penyakit</p>
            <p>Kondisi</p>
            <p>Status</p>
          </div>

          {history.length > 0 ? (
            history.map((item, i) => (
              <div key={i} className="grid grid-cols-4 text-sm py-1">
                <p>{item.created_at?.split("T")[0]}</p>
                <p>{item.nama_penyakit}</p>
                <p>{item.kondisi}</p>
                <p className="text-red-600">Sakit</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Belum ada riwayat</p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          {analysis && (
            <button
              onClick={saveToHistory}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
            >
              Simpan Hasil
            </button>
          )}
        </div>
      </div>

    {modalOpen && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-4 shadow-lg max-w-sm w-full relative pointer-events-auto overflow-hidden">

          <button
            className="absolute top-2 right-2 text-xl z-10"
            onClick={() => setModalOpen(false)}
          >
            ✖
          </button>

          <img
            src={preview}
            className="w-full max-h-80 object-cover rounded-lg mb-4 pointer-events-none select-none"
            alt=""
          />

          <button
            onClick={detectDisease}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow"
          >
            Klik untuk Deteksi Penyakit
          </button>

        </div>
      </div>
    )}

    </div>
  );
}
