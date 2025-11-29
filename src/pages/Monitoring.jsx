import { useState } from "react";

export default function Monitoring() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([
    {
      tanggal: "28/11/2025",
      kode: "AV001",
      penyakit: "Antraknosa",
      status: "Sakit",
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setModalOpen(true);
    }
  };

  const detectDisease = () => {
    setAnalysis({
      penyakit: "Antraknosa",
      saran: [
        "Bersihkan daun/ranting yang kena bercak hitam dan buang buah busuk.",
        "Semprot azoxystrobin atau difenoconazole (0,1–0,2%).",
        "Tabur Trichoderma harzianum di sekitar akar.",
        "Semprot ulang fungisida tembaga untuk proteksi lanjutan.",
      ],
    });
    setModalOpen(false);
  };

  const saveToHistory = () => {
    if (!analysis) return;
    const newEntry = {
      tanggal: new Date().toLocaleDateString(),
      kode: "AV002",
      penyakit: analysis.penyakit,
      status: "Sakit",
    };
    setHistory([...history, newEntry]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* UPLOAD SECTION */}
      <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Input Foto Pohon</h2>
          <label className="border rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100">
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            <div className="text-center text-gray-600">
              <p className="text-lg">📁</p>
              <p>Input Foto</p>
            </div>
          </label>
        </div>

        {/* Uploaded Preview */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Hasil Input Foto</h2>
          <div className="border rounded-xl h-40 flex items-center justify-center bg-gray-50 overflow-hidden">
            {preview ? (
              <img src={preview} alt="preview" className="h-full object-contain" />
            ) : (
              <p className="text-gray-400">Belum ada gambar</p>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Result */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Hasil Analisis</h3>
        {analysis ? (
          <div className="bg-green-50 border border-green-300 rounded-xl p-4">
            <p className="font-semibold text-green-700 mb-2">Penyakit: {analysis.penyakit}</p>

            <p className="font-semibold mb-2">Rencana Treatment Antraknosa (Alpukat Hass)</p>
            <ul className="list-disc ml-6 text-sm space-y-1 text-gray-700">
              <li><b>Minggu 1 – Bersih & Semprot Awal:</b> Bersihkan daun/ranting yang kena bercak hitam dan buang buah busuk. Semprot tembaga oksiklorida/mankozeb (0,2%).</li>
              <li><b>Minggu 2 – Obat Jamur Lanjutan:</b> Semprot azoxystrobin atau difenoconazole (0,1–0,2%).</li>
              <li><b>Minggu 3 – Trichoderma & Pemangkasan:</b> Tabur Trichoderma harzianum ±1 genggam/pohon. Pangkas ringan agar udara masuk.</li>
              <li><b>Minggu 4 – Proteksi Ulang:</b> Semprot ulang fungisida tembaga hidroksida (0,2%).</li>
            </ul>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Belum ada analisis</p>
        )}
      </div>

      {/* History */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Riwayat Deteksi Penyakit</h3>

        <div className="border rounded-xl p-4 bg-green-50">
          <div className="grid grid-cols-4 font-semibold text-gray-600 border-b pb-2 mb-2 text-sm">
            <p>Tanggal</p>
            <p>Kode Pohon</p>
            <p>Penyakit</p>
            <p>Status</p>
          </div>

          {history.map((item, i) => (
            <div key={i} className="grid grid-cols-4 text-sm text-gray-700 py-1">
              <p>{item.tanggal}</p>
              <p>{item.kode}</p>
              <p>{item.penyakit}</p>
              <p>{item.status}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={saveToHistory} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
            Simpan Hasil
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700">
            Keluar
          </button>
        </div>
      </div>

      {/* POPUP IMAGE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 shadow-lg max-w-sm w-full relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setModalOpen(false)}>✖</button>

            <img src={preview} className="w-full rounded-lg mb-4" />

            <button
              onClick={detectDisease}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow"
            >
              Klik untuk Deteksi Penyakit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
