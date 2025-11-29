import { useState } from "react";
import KebunService from "../../services/KebunService";

export default function EditKebunModal({ initialData, onClose, refresh }) {
  const [form, setForm] = useState({
    nama_kebun: initialData.nama_kebun,
    mdpl: initialData.mdpl,
  });

  const handleSubmit = async () => {
    await KebunService.update(initialData.id, form);
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="font-bold text-xl mb-4">Edit Kebun</h2>

        <input
          placeholder="Nama Kebun"
          className="border px-3 py-2 w-full rounded mb-3"
          value={form.nama_kebun}
          onChange={(e) => setForm({ ...form, nama_kebun: e.target.value })}
        />

        <input
          placeholder="MDPL"
          className="border px-3 py-2 w-full rounded mb-3"
          value={form.mdpl}
          onChange={(e) => setForm({ ...form, mdpl: e.target.value })}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={onClose}>
            Batal
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSubmit}>
            Perbarui
          </button>
        </div>
      </div>
    </div>
  );
}
