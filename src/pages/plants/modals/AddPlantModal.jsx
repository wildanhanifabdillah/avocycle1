// src/pages/dashboard/AddPlantModal.jsx
import { useState, useRef } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaChevronDown,
  FaFolderOpen,
} from "react-icons/fa";

export default function AddPlantModal({ onClose, kebunId, onSuccess }) {
  const [form, setForm] = useState({
    namaTanaman: "",
    type: "",
    date: "",
    period: "",
    code: "",
    kodeBlok: "",
    photo: null,
  });

  const fileRef = useRef(null);
  const dateRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((s) => ({ ...s, [name]: files ? files[0] : value }));
  };

  // Normalisasi tanggal ke yyyy-mm-dd (aman kalau ada yang ngetik dd/mm/yyyy)
  const normalizeDateToIso = (value) => {
    if (!value) return "";

    // Kalau user nulis manual dd/mm/yy atau dd/mm/yyyy
    if (value.includes("/")) {
      const [d, m, y] = value.split("/");
      if (!d || !m || !y) return "";

      let year = parseInt(y, 10);
      if (String(y).length === 2) {
        year = 2000 + year;
      }

      const dd = String(parseInt(d, 10)).padStart(2, "0");
      const mm = String(parseInt(m, 10)).padStart(2, "0");
      const yyyy = String(year).padStart(4, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    // type="date" dari browser memang sudah yyyy-mm-dd
    return value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Guard: jangan kirim kalau kebunId belum ada
      if (!kebunId && kebunId !== 0) {
        alert(
          "ID kebun belum terisi. Pastikan flow: pilih kebun dulu, baru tambah tanaman."
        );
        console.error("kebunId is missing in AddPlantModal props:", kebunId);
        return;
      }

      const isoDate = normalizeDateToIso(form.date);

      const formData = new FormData();
      formData.append("nama_tanaman", form.namaTanaman);
      formData.append(
        "varietas",
        form.type === "mentega" ? "Var1" : form.type === "miki" ? "Var2" : ""
      );
      formData.append("tanggal_tanam", isoDate);
      formData.append("kebun_id", String(kebunId)); // dari props
      formData.append("kode_blok", form.kodeBlok);
      formData.append("kode_tanaman", form.code);
      formData.append("masa_produksi", form.period);
      if (form.photo) {
        formData.append("foto_tanaman", form.photo);
      }

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:2005/api/v1/tanaman", {
        method: "POST",
        body: formData,
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      let body = null;
      try {
        body = await response.json();
      } catch (_) {
        // ignore kalau response bukan json
      }

      if (!response.ok) {
        console.error("API error:", body);
        throw new Error(body?.message || "Input tidak valid");
      }

      alert("Tanaman ditambahkan!");

      // kasih tahu parent kalau sukses
      if (typeof onSuccess === "function") {
        onSuccess(body?.data || null);
      }
      // parent yang akan nutup modal (biar flow-nya konsisten)
    } catch (err) {
      console.error("Failed to add plant:", err);
      alert(err.message || "Gagal menambahkan tanaman.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl relative">
        {/* Close */}
        <button
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="mb-1 text-lg font-semibold">Tambah tanaman</h2>
        {kebunId !== undefined && kebunId !== null && (
          <p className="mb-4 text-xs text-gray-600">
            Kebun terpilih: <span className="font-semibold">#{kebunId}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              {/* Nama Tanaman */}
              <div className="space-y-1 mb-2">
                <label className="text-sm font-medium">Nama Tanaman:</label>
                <input
                  type="text"
                  name="namaTanaman"
                  value={form.namaTanaman}
                  onChange={handleChange}
                  placeholder="Masukkan nama tanaman"
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Jenis Alpukat */}
              <div className="space-y-1 mb-2">
                <label className="text-sm font-medium">Jenis Alpukat:</label>
                <div className="relative">
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-md border px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">{`--Pilih jenis--`}</option>
                    <option value="mentega">Alpukat Mentega</option>
                    <option value="miki">Alpukat Miki</option>
                  </select>
                  <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              {/* Kode Blok */}
              <div className="space-y-1 mb-2">
                <label className="text-sm font-medium">Kode Blok:</label>
                <input
                  type="text"
                  name="kodeBlok"
                  value={form.kodeBlok}
                  onChange={handleChange}
                  placeholder="Masukkan kode blok"
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex-1">
              {/* Tanggal Tanam */}
              <div className="space-y-1 mb-2">
                <label className="text-sm font-medium">Tanggal Tanam:</label>
                <div className="relative">
                  <input
                    ref={dateRef}
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full rounded-md border px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none no-native-date-icon"
                  />
                  <button
                    type="button"
                    aria-label="Buka kalender"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700"
                    onClick={() => {
                      const el = dateRef.current;
                      if (!el) return;
                      if (typeof el.showPicker === "function") {
                        el.showPicker();
                      } else {
                        el.focus();
                        try {
                          el.click();
                        } catch (err) {
                          console.warn(err);
                        }
                      }
                    }}
                  >
                    <FaCalendarAlt />
                  </button>
                </div>
              </div>

              {/* Masa Produksi */}
              <div className="space-y-1 mb-2">
                <label className="text-sm font-medium">
                  Masa Produksi (hari):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="period"
                    value={form.period}
                    onChange={handleChange}
                    placeholder="Lama masa produksi (hari)"
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Kode Tanaman */}
              <div className="space-y-1 mb-2">
                <label className="text-sm font-medium">Kode Tanaman:</label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="Kode unik tanaman (mis. AV-001)"
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Foto Tanaman */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Foto Tanaman:</label>
            <div className="rounded-md border-2 border-dashed p-6 text-center">
              <FaFolderOpen className="mx-auto mb-3 text-5xl text-gray-400" />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                name="photo"
                onChange={handleChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Buka File
              </button>
              {form.photo && (
                <p className="mt-2 text-xs text-gray-600 truncate">
                  {form.photo.name}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-2 flex justify-between sm:justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Tambahkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
