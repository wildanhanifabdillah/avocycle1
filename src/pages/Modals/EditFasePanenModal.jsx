import { useEffect, useRef, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function EditFasePanenModal({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState({
    date: "",
    jumlahPanen: "",
    jumlahSampel: "",
    beratTotal: "",
    catatan: "",
    fotoPanen: "",
    fotoFile: null,
  });

  const dateRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    setForm({
      date: initialData?.date || "",
      jumlahPanen: initialData?.jumlahPanen || "",
      jumlahSampel: initialData?.jumlahSampel || "",
      beratTotal: initialData?.beratTotal || "",
      catatan: initialData?.catatan || "",
      fotoPanen: initialData?.fotoPanen || "",
      fotoFile: null,
    });
  }, [open, initialData]);

  const update = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleDate = (e) => {
    const v = e.target.value;
    if (!v) return;
    const [y, m, d] = v.split("-");
    setForm((p) => ({ ...p, date: `${d}/${m}/${y}` }));
  };

  const handleSave = () => {
    onSave?.({ ...form, id: initialData?.id });
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-2xl">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Fase Panen</h3>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Tanggal Panen */}
          <div>
            <label className="block text-sm mb-1">Tanggal Panen:</label>
            <div className="relative">
              <input
                type="text"
                value={form.date}
                onChange={update("date")}
                placeholder="DD/MM/YYYY"
                className="w-full border rounded-md py-2 pl-3 pr-10 text-sm"
              />
              <input
                type="date"
                ref={dateRef}
                className="absolute opacity-0 pointer-events-none"
                onChange={handleDate}
              />
              <FaRegCalendarAlt
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-green-600"
                onClick={() =>
                  dateRef.current?.showPicker
                    ? dateRef.current.showPicker()
                    : dateRef.current?.click()
                }
              />
            </div>
          </div>

          {/* Jumlah Panen */}
          <div>
            <label className="block text-sm mb-1">Jumlah Panen:</label>
            <input
              type="text"
              value={form.jumlahPanen}
              onChange={update("jumlahPanen")}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Jumlah Sampel */}
          <div>
            <label className="block text-sm mb-1">Jumlah Sampel:</label>
            <input
              type="text"
              value={form.jumlahSampel}
              onChange={update("jumlahSampel")}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Berat Total */}
          <div>
            <label className="block text-sm mb-1">Berat Total (kg):</label>
            <input
              type="text"
              value={form.beratTotal}
              onChange={update("beratTotal")}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm mb-1">Catatan:</label>
            <textarea
              value={form.catatan}
              onChange={update("catatan")}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Foto Panen */}
          <div>
            <label className="block text-sm mb-1">Foto Panen (opsional):</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setForm((p) => ({ ...p, fotoFile: file, fotoPanen: file?.name || "" }));
              }}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            {form.fotoPanen && (
              <p className="text-xs text-gray-500 mt-1">Dipilih: {form.fotoPanen}</p>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Simpan
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
