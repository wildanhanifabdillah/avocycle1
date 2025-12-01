import { useEffect, useRef, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function EditFaseBerbungaModal({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState({
    date: "",
    munculBunga: "",
    pecahBunga: "",
    pentilPertama: "",
  });
  const dateRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setForm({
      date: initialData?.date || "",
      munculBunga: initialData?.munculBunga || "",
      pecahBunga: initialData?.pecahBunga || "",
      pentilPertama: initialData?.pentilPertama || "",
    });
  }, [open, initialData]);

  const update = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleDate = (e) => {
    const v = e.target.value; // yyyy-mm-dd
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
          <h3 className="text-lg font-semibold">Fase Berbunga</h3>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* date */}
          <div>
            <label className="block text-sm mb-1">Tanggal muncul:</label>
            <div className="relative">
              <input
                type="text"
                value={form.date}
                onChange={update("date")}
                placeholder="DD/MM/YYYY"
                className="w-full border rounded-md pl-3 pr-10 py-2 text-sm"
              />
              <input
                ref={dateRef}
                type="date"
                className="absolute opacity-0 pointer-events-none"
                onChange={handleDate}
              />
              <FaRegCalendarAlt
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 cursor-pointer"
                onClick={() =>
                  dateRef.current?.showPicker
                    ? dateRef.current.showPicker()
                    : dateRef.current?.click()
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Muncul bunga:</label>
            <input
              type="text"
              value={form.munculBunga}
              onChange={update("munculBunga")}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Pecah bunga:</label>
            <input
              type="text"
              value={form.pecahBunga}
              onChange={update("pecahBunga")}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Pentil buah pertama:</label>
            <input
              type="text"
              value={form.pentilPertama}
              onChange={update("pentilPertama")}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
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
