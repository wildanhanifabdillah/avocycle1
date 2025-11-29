import { useState } from "react";

export default function HistoryDetection() {
  const [selected, setSelected] = useState(null);

  // ============ DATA DUMMY ============
  const history = [
    {
      kode: "P101",
      jenis: "Alpukat Mentega",
      penyakit: "Antraknosa",
      tanggal: "17/09/2025",
      status: "Sakit",
      image:
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80"
    }
  ];

  // ========================================================
  // =============== HALAMAN DETAIL =========================
  // ========================================================
  if (selected) {
    return (
      <div className="px-6 py-6 space-y-6">

        {/* Gambar Besar */}
        <div className="w-full h-64 rounded-xl overflow-hidden shadow border border-green-300 bg-gray-100">
          <img
            src={selected.image}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Judul */}
        <h2 className="text-xl font-bold text-gray-800">
          Hasil Analisis Tanggal 21/10/2025
        </h2>

        {/* Saran / Treatment */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-green-300">
          <p className="font-semibold text-lg">Penyakit: {selected.penyakit}</p>

          <p className="mt-4 font-semibold">Saran:</p>

          <div className="mt-3 bg-green-100 p-4 rounded-xl space-y-3 text-sm leading-relaxed">
            <p className="font-bold">
              Rencana Treatment Antraknosa (Alpukat Hass)
            </p>

            <p>
              <span className="font-semibold">Minggu 1 – Bersih & Semprot Awal</span><br />
              Bersihkan daun/ranting yang kena bercak hitam dan buang buah busuk.
              Semprot tembaga oksiklorida atau mankozeb (0,2%).
            </p>

            <p>
              <span className="font-semibold">Minggu 2 – Obat Jamur Lanjutan</span><br />
              Ganti semprotan dengan azoxystrobin atau difenoconazole (0,1–0,2%).
            </p>

            <p>
              <span className="font-semibold">Minggu 3 – Trichoderma & Pemangkasan</span><br />
              Tabur Trichoderma di sekitar akar dan pangkas untuk sirkulasi udara.
            </p>

            <p>
              <span className="font-semibold">Minggu 4 – Proteksi Ulang</span><br />
              Semprot ulang mankozeb atau tembaga hidroksida (0,2%) untuk perlindungan.
            </p>
          </div>
        </div>

        {/* Riwayat Deteksi */}
        <div className="bg-white rounded-xl border border-green-300 shadow-md p-6">
          <p className="text-lg font-semibold mb-4">Riwayat Deteksi Penyakit</p>

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
                <td className="py-2">2/10/2025</td>
                <td className="py-2">{selected.kode}</td>
                <td className="py-2">{selected.penyakit}</td>
                <td className="py-2 text-green-700 font-semibold">{selected.status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tombol */}
        <button
          onClick={() => setSelected(null)}
          className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-green-700"
        >
          Keluar
        </button>
      </div>
    );
  }

  // ========================================================
  // =============== HALAMAN LIST + PAGINATION ==============
  // ========================================================
  return (
    <div className="px-6 py-6 space-y-10">

      <h2 className="text-xl font-bold text-gray-800">Riwayat Deteksi</h2>

      {history.map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-green-500 shadow-md p-5 flex items-center gap-5 hover:shadow-lg transition"
        >
          {/* Gambar */}
          <div className="w-24 h-24 rounded-xl overflow-hidden border bg-gray-200">
            <img src={item.image} className="w-full h-full object-cover" />
          </div>

          {/* Informasi */}
          <div className="flex-1">
            <p className="font-bold text-lg">{item.kode}</p>
            <p className="text-gray-700 text-sm">Jenis: {item.jenis}</p>
            <p className="text-sm">Penyakit: {item.penyakit}</p>
            <p className="text-sm text-gray-500">Tanggal cek: {item.tanggal}</p>
            <p className="text-sm text-red-600 font-semibold">Status: {item.status}</p>
          </div>

          {/* Tombol */}
          <button
            onClick={() => setSelected(item)}
            className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700"
          >
            Lihat Detail
          </button>
        </div>
      ))}

      {/* ================= PAGINATION ================= */}
      <div className="w-full flex justify-center items-center gap-4 text-gray-700 select-none">

        {/* Panah Kiri */}
        <button className="px-3 py-1 rounded hover:bg-green-200">
          <span className="text-xl">&lt;</span>
        </button>

        {/* Nomor Halaman */}
        <button className="px-3 py-1 bg-green-600 text-white rounded-md shadow">
          1
        </button>

        <button className="px-3 py-1 hover:bg-green-100 rounded-md">2</button>
        <button className="px-3 py-1 hover:bg-green-100 rounded-md">3</button>

        <span className="px-3">...</span>

        {/* Panah Kanan */}
        <button className="px-3 py-1 rounded hover:bg-green-200">
          <span className="text-xl">&gt;</span>
        </button>

      </div>
    </div>
  );
}
