import { useEffect, useRef, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function EditFaseBerbuahModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({ date: "", cover: "", labelColor: "red", estimasi: "" });
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({
        date: initialData?.date || "",
        cover: initialData?.cover || "",
        labelColor: initialData?.labelColor || "red",
        estimasi: initialData?.estimasi || "",
      });
    }
  }, [open, initialData]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-2xl">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Fase Berbuah</h3>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Tanggal cover:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="DD/MM/YY"
                value={form.date}
                onChange={update("date")}
                className="w-full rounded-md border border-gray-300 pr-10 pl-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              />
              {/* hidden real date input */}
              <input
                ref={dateInputRef}
                type="date"
                className="absolute w-0 h-0 opacity-0 pointer-events-none"
                onChange={(e) => {
                  const val = e.target.value; // yyyy-mm-dd
                  if (!val) return;
                  const [y, m, d] = val.split("-");
                  const formatted = `${d}/${m}/${y}`;
                  setForm((f) => ({ ...f, date: formatted }));
                }}
              />
              <FaRegCalendarAlt
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 cursor-pointer"
                onClick={() => {
                  if (dateInputRef.current?.showPicker) dateInputRef.current.showPicker();
                  else dateInputRef.current?.click();
                }}
                role="button"
                aria-label="Pilih tanggal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Buah yang dicover:</label>
            <input
              type="text"
              placeholder="Masukkan jumlah (angka) ('-' jika tidak ada)"
              value={form.cover}
              onChange={update("cover")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Warna label:</label>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: form.labelColor }}
              />
              <select
                value={form.labelColor}
                onChange={update("labelColor")}
                className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              >
                <option value="red">Merah</option>
                <option value="yellow">Kuning</option>
                <option value="green">Hijau</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onSave?.(form);
                onClose?.();
              }}
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white font-medium shadow hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md bg-gray-300 px-4 py-2 text-gray-800 font-medium shadow hover:bg-gray-400"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
