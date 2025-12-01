import { useEffect, useRef, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function EditFaseBerbuahModal({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState({
    date: "",
    cover: "",
    labelColor: "Merah",
  });

  const dateRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    setForm({
      date: initialData?.date || "",
      cover: initialData?.cover || "",
      labelColor: initialData?.labelColor || "Merah",
    });
  }, [open, initialData]);

  const update = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handlePick = (ref) => {
    if (ref.current?.showPicker) ref.current.showPicker();
    else ref.current?.click();
  };

  const handleDate = (key) => (e) => {
    const v = e.target.value;
    if (!v) return;
    const [y, m, d] = v.split("-");
    setForm((p) => ({ ...p, [key]: `${d}/${m}/${y}` }));
  };

  const handleSave = () => {
    onSave?.({ ...form, id: initialData?.id });
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-xl">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Fase Berbuah</h3>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Tanggal Cover */}
          <div>
            <label className="block text-sm mb-1">Tanggal Cover:</label>
            <div className="relative">
              <input
                type="text"
                value={form.date}
                onChange={update("date")}
                placeholder="DD/MM/YYYY"
                className="w-full border rounded-md pl-3 pr-10 py-2 text-sm"
              />
              <input type="date" ref={dateRef} className="hidden" onChange={handleDate("date")} />
              <FaRegCalendarAlt
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 cursor-pointer"
                onClick={() => handlePick(dateRef)}
              />
            </div>
          </div>

          {/* Jumlah Cover */}
          <div>
            <label className="block text-sm mb-1">Jumlah Cover:</label>
            <input
              type="text"
              value={form.cover}
              onChange={update("cover")}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Warna Label */}
          <div>
            <label className="block text-sm mb-1">Warna Label:</label>
            <select
              value={form.labelColor}
              onChange={update("labelColor")}
              className="w-full border rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="Merah">Merah</option>
              <option value="Kuning">Kuning</option>
              <option value="Hijau">Hijau</option>
            </select>
          </div>
        </div>

        <div className="px-6 pb-6 grid grid-cols-2 gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md" onClick={handleSave}>
            Simpan
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded-md" onClick={onClose}>
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
