import { useState, useRef, useEffect } from "react";
import { FaTimes, FaCalendarAlt, FaChevronDown, FaFolderOpen } from "react-icons/fa";

export default function EditPlantModal({ onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    type: "",
    date: "",
    period: "",
    code: "",
    photo: null,
  });
  const fileRef = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setForm((s) => ({
        ...s,
        type: initialData.type || "",
        date: initialData.date || "",
        period: initialData.period || "",
        code: initialData.code || "",
        photo: null,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((s) => ({ ...s, [name]: files ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        {/* Close */}
        <button
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Tutup"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="mb-4 text-lg font-semibold">Edit Tanaman</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Jenis Alpukat */}
          <div className="space-y-1">
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

          {/* Tanggal Tanam */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tanggal Tanam:</label>
            <div className="relative">
              <input
                ref={dateRef}
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                placeholder="DD/MM/YY"
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
                    // Fallback: trigger a click to hint some browsers
                    try { el.click(); } catch (e) { console.debug("Date input click fallback failed", e); }
                  }
                }}
              >
                <FaCalendarAlt />
              </button>
            </div>
          </div>

          {/* Periode */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Periode:</label>
            <div className="relative">
              <input
                type="number"
                name="period"
                value={form.period}
                onChange={handleChange}
                placeholder="Jarak buah di cover dan panen (hari)"
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Kode Unik */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Input Kode Unik:</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Ketik untuk penanda pohon (bebas)"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
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
                Buka Folder
              </button>
              {form.photo && (
                <p className="mt-2 truncate text-xs text-gray-600">{form.photo.name}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-2 flex justify-between gap-3 sm:justify-end">
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
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
