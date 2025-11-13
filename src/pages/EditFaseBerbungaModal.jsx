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
  const dateInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({
        date: initialData?.date || "",
        munculBunga: initialData?.munculBunga || "",
        pecahBunga: initialData?.pecahBunga || "",
        pentilPertama: initialData?.pentilPertama || "",
      });
    }
  }, [open, initialData]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    onSave?.(form);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-2xl">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Fase Berbunga</h3>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Tanggal muncul:</label>
            <div className="relative">
              <input
                type="text"
                value={form.date}
                onChange={update("date")}
                placeholder="DD/MM/YY"
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
            <label className="block text-sm text-gray-700 mb-1">Muncul bunga:</label>
            <input
              type="text"
              value={form.munculBunga}
              onChange={update("munculBunga")}
              placeholder="Masukkan jumlah (angka) ('-' jika tidak ada)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Pecah bunga:</label>
            <input
              type="text"
              value={form.pecahBunga}
              onChange={update("pecahBunga")}
              placeholder="Masukkan jumlah (angka) ('-' jika tidak ada)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Pentil buah pertama:</label>
            <input
              type="text"
              value={form.pentilPertama}
              onChange={update("pentilPertama")}
              placeholder="Masukkan jumlah (angka) ('-' jika tidak ada)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSave}
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
