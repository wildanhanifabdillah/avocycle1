import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function EditFaseBerbuahModal({
  open,
  onClose,
  onSave,
  initialData,   // null = tambah, object = edit
  plantId,
}) {
  const [form, setForm] = useState({
    mingguKe: "",
    tanggalCatat: "",
    tanggalCover: "",
    jumlahCover: "",
    warnaLabel: "red",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!initialData;

  // helper normalisasi tanggal ke 'YYYY-MM-DD' untuk input date
  const toYMD = (value) => {
    if (!value) return "";

    // sudah yyyy-mm-dd atau yyyy-mm-ddTHH:MM:SS
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }

    // dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [d, m, y] = value.split("/");
      return `${y}-${m}-${d}`;
    }

    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  // Prefill kalau edit, reset kalau tambah
  useEffect(() => {
    if (!open) return;

    setError(null);

    if (initialData) {
      const backend = initialData.backend || initialData;

      const mingguKe =
        backend.MingguKe ??
        backend.minggu_ke ??
        initialData.mingguKe ??
        "";

      const tanggalCatat =
        backend.TanggalCatat ??
        backend.tanggal_catat ??
        backend.tanggalCatat ??
        "";

      const tanggalCover =
        backend.TanggalCover ??
        backend.tanggal_cover ??
        backend.tanggalCover ??
        initialData.date ??
        "";

      const jumlahCover =
        backend.JumlahCover ??
        backend.jumlah_cover ??
        backend.jumlahCover ??
        initialData.cover ??
        "";

      const warnaLabel =
        backend.WarnaLabel ??
        backend.warna_label ??
        backend.warnaLabel ??
        initialData.labelColor ??
        "red";

      setForm({
        mingguKe: String(mingguKe ?? ""),
        tanggalCatat: toYMD(tanggalCatat) || toYMD(tanggalCover),
        tanggalCover: toYMD(tanggalCover),
        jumlahCover: String(jumlahCover ?? ""),
        warnaLabel: warnaLabel || "red",
      });
    } else {
      // mode tambah
      const today = new Date().toISOString().split("T")[0];
      setForm({
        mingguKe: "",
        tanggalCatat: today,
        tanggalCover: "",
        jumlahCover: "",
        warnaLabel: "red",
      });
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const payload = {
        minggu_ke: Number(form.mingguKe || 0),
        tanggal_catat: form.tanggalCatat,       // YYYY-MM-DD
        tanggal_cover: form.tanggalCover,       // YYYY-MM-DD
        jumlah_cover: Number(form.jumlahCover || 0),
        warna_label: form.warnaLabel,  // YYYY-MM-DD
        tanaman_id: Number(plantId),
      };

      const token = localStorage.getItem("token");

      let url = "http://localhost:2005/api/v1/petani/fase-berbuah";
      let method = "POST";

      if (isEdit) {
        const idFromRow =
          initialData.id ??
          initialData.backend?.ID ??
          initialData.backend?.id;

        url = `http://localhost:2005/api/v1/petani/fase-berbuah/${idFromRow}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Gagal menyimpan fase berbuah");
      }

      onSave?.(json.data);
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-2xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Fase Berbuah" : "Tambah Fase Berbuah"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {error && (
            <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">
                Minggu ke
              </label>
              <input
                type="number"
                name="mingguKe"
                value={form.mingguKe}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">
                Tanggal catat
              </label>
              <input
                type="date"
                name="tanggalCatat"
                value={form.tanggalCatat}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">
                Tanggal cover
              </label>
              <input
                type="date"
                name="tanggalCover"
                value={form.tanggalCover}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">
                Buah yang dicover
              </label>
              <input
                type="number"
                name="jumlahCover"
                value={form.jumlahCover}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-1">
                Warna label
              </label>
              <select
                name="warnaLabel"
                value={form.warnaLabel}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              >
                <option value="red">Merah</option>
                <option value="yellow">Kuning</option>
                <option value="green">Hijau</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md bg-gray-300 px-4 py-2 text-gray-800 font-medium shadow hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white font-medium shadow hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
