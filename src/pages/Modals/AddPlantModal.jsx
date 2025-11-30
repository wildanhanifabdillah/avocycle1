import { useState, useRef } from "react";
import TanamanService from "../../services/TanamanService";

export default function AddPlantModal({ kebunId, onClose, onSuccess }) {
  const dateRef = useRef(null);
  const [form, setForm] = useState({
    nama_tanaman: "",
    varietas: "Var1",
    tanggal_tanam: "",
    masa_produksi: 180,
    kode_blok: "",
    kode_tanaman: "",
  });

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);

      const idNum = Number(kebunId);
      const payload = {
        // camel/snake
        nama_tanaman: form.nama_tanaman,
        varietas: form.varietas,
        tanggal_tanam: form.tanggal_tanam,
        masa_produksi: Number(form.masa_produksi),
        kebun_id: idNum,
        kode_blok: form.kode_blok,
        kode_tanaman: form.kode_tanaman,
        // Pascal fallback
        NamaTanaman: form.nama_tanaman,
        Varietas: form.varietas,
        TanggalTanam: form.tanggal_tanam,
        MasaProduksi: Number(form.masa_produksi),
        KebunID: idNum,
        KodeBlok: form.kode_blok,
        KodeTanaman: form.kode_tanaman,
      };

      await TanamanService.create(payload);

      onSuccess?.(); // Plants.jsx reload
    } catch (err) {
      console.error("Gagal membuat tanaman", err);
      alert("Gagal membuat tanaman");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-lg">Tambah Tanaman</h2>
        </div>

        <div className="space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nama Tanaman"
            value={form.nama_tanaman}
            onChange={(e) => setForm({ ...form, nama_tanaman: e.target.value })}
          />

          <select
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.varietas}
            onChange={(e) => setForm({ ...form, varietas: e.target.value })}
          >
            <option value="Var1">Alpukat Mentega</option>
            <option value="Var2">Alpukat Miki</option>
          </select>

          <div className="relative">
            <input
              type="date"
              ref={dateRef}
              className="w-full border rounded-lg px-3 py-2 pr-10 no-native-date-icon focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.tanggal_tanam}
              onChange={(e) =>
                setForm({ ...form, tanggal_tanam: e.target.value })
              }
            />
            <img
              src="/icons/calendar.svg"
              alt=""
              className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() =>
                dateRef.current?.showPicker
                  ? dateRef.current.showPicker()
                  : dateRef.current?.click()
              }
            />
          </div>

          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Masa Produksi (hari)"
            type="number"
            value={form.masa_produksi}
            onChange={(e) =>
              setForm({ ...form, masa_produksi: e.target.value })
            }
          />

          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Kode Blok"
            value={form.kode_blok}
            onChange={(e) => setForm({ ...form, kode_blok: e.target.value })}
          />

          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Kode Tanaman"
            value={form.kode_tanaman}
            onChange={(e) =>
              setForm({ ...form, kode_tanaman: e.target.value })
            }
          />
        </div>

        <div className="flex justify-between pt-2">
          <button
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            Tutup
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
            onClick={handleCreate}
            disabled={loading}
            type="button"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
