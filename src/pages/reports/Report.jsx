import { useState } from "react";
import { FaFileDownload, FaTrashAlt } from "react-icons/fa";

export default function Report() {
  const [reports, setReports] = useState([
    {
      id: 1,
      tanggal: "24/10/2025",
      kode: "AV001",
      penyakit: "Antraknosa",
      status: "Sudah dirawat",
    },
    {
      id: 2,
      tanggal: "23/10/2025",
      kode: "AV002",
      penyakit: "Busuk Akar",
      status: "Menunggu tindak lanjut",
    },
    {
      id: 3,
      tanggal: "22/10/2025",
      kode: "AV003",
      penyakit: "Bercak Daun",
      status: "Sudah dirawat",
    },
  ]);

  const handleDownload = (id) => {
    alert(`Laporan penyakit ${id} berhasil diunduh (simulasi)`);
  };

  const handleDelete = (id) => {
    if (confirm("Hapus laporan ini?")) {
      setReports(reports.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="font-semibold text-gray-700 mb-4">
          Daftar Riwayat Laporan Penyakit
        </h2>

        {/* Header Tabel */}
        <div className="border border-green-300 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-green-100 border-b border-green-300">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">Tanggal</th>
                <th className="text-left px-4 py-2 font-semibold">
                  Kode Pohon
                </th>
                <th className="text-left px-4 py-2 font-semibold">Penyakit</th>
                <th className="text-left px-4 py-2 font-semibold">Status</th>
                <th className="text-center px-4 py-2 font-semibold w-32">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {reports.length > 0 ? (
                reports.map((r) => (
                  <tr
                    key={r.id}
                    className="even:bg-green-50 hover:bg-green-100 transition"
                  >
                    <td className="px-4 py-2">{r.tanggal}</td>
                    <td className="px-4 py-2">{r.kode}</td>
                    <td className="px-4 py-2">{r.penyakit}</td>
                    <td className="px-4 py-2">{r.status}</td>
                    <td className="px-4 py-2 text-center flex justify-center gap-3">
                      <button
                        onClick={() => handleDownload(r.id)}
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 shadow"
                        title="Unduh Laporan"
                      >
                        <FaFileDownload size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow"
                        title="Hapus Laporan"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    Tidak ada laporan penyakit
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tombol Aksi Bawah */}
        <div className="flex justify-end gap-3 mt-4">
          <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 shadow">
            Cetak Semua
          </button>
          <button className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 shadow">
            Hapus Semua
          </button>
        </div>
      </div>
    </div>
  );
}
