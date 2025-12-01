import { useState } from "react";

export default function Monitoring() {
  const [form, setForm] = useState({
    kode: "",
    foto: "",
    deskripsi: "",
  });

  const [hasil, setHasil] = useState({
    tanggal: "24/10/2025",
    kode: "AV001",
    penyakit: "Antraknosa",
    status: "Sudah dirawat",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Data dikirim (simulasi)");
  };

  return (
    <div className="space-y-6">
      {/* Form Input */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Deteksi Penyakit</h2>

        {/* Form Deteksi */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Kode Pohon */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Input Kode Pohon
            </label>

            <div className="grid grid-cols-[1fr_auto] gap-4">
              <input
                type="text"
                name="kode"
                value={form.kode}
                onChange={handleChange}
                placeholder="Masukkan kode pohon"
                className="border rounded-lg px-3 py-2 focus:outline-green-500 w-full"
              />

              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow font-medium"
              >
                Input
              </button>
            </div>
          </div>

          {/* Input Foto Pohon dan Ciri Penyakit */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Input Foto & Ciri-Ciri Penyakit
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Foto Pohon */}
              <div className="flex flex-col border border-gray-300 rounded-md bg-gray-50 p-4">
                <label className="text-sm text-gray-700 mb-2 font-medium">
                  Foto Pohon
                </label>
                <input
                  type="file"
                  name="foto"
                  accept="image/*"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-green-500 resize-none text-sm"
                />
              </div>

              {/* Deskripsi Penyakit */}
              <div className="flex flex-col border border-gray-300 rounded-md bg-gray-50 p-4">
                <label className="text-sm text-gray-700 mb-2 font-medium">
                  Ciri-Ciri Penyakit
                </label>
                <textarea
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tuliskan ciri-ciri penyakit yang terlihat..."
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-green-500 resize-none text-sm"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Hasil Analisis */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Hasil Analisis</h3>
        <div className="border border-green-300 rounded-xl p-4 bg-green-50">
          <div className="grid grid-cols-4 text-sm font-medium text-gray-600 border-b pb-2 mb-2">
            <p>Tanggal</p>
            <p>Kode Pohon</p>
            <p>Penyakit</p>
            <p>Status</p>
          </div>
          <div className="grid grid-cols-4 text-sm text-gray-700">
            <p>{hasil.tanggal}</p>
            <p>{hasil.kode}</p>
            <p>{hasil.penyakit}</p>
            <p>{hasil.status}</p>
          </div>
        </div>
      </div>

      {/* Riwayat Deteksi */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-700 mb-4">
          Riwayat Deteksi Penyakit
        </h3>

        <div className="border border-green-300 rounded-xl p-4 bg-green-50 mb-4">
          <div className="grid grid-cols-4 text-sm font-medium text-gray-600 border-b pb-2 mb-2">
            <p>Tanggal</p>
            <p>Kode Pohon</p>
            <p>Penyakit</p>
            <p>Status</p>
          </div>
          <div className="grid grid-cols-4 text-sm text-gray-700">
            <p>24/10/2025</p>
            <p>AV001</p>
            <p>Antraknosa</p>
            <p>Sudah dirawat</p>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3 mt-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow">
            Simpan Hasil
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow">
            Cetak Laporan
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow">
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
