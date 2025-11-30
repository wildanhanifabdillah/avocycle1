import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function EditFaseBerbungaModal({
  open,
  onClose,
  plantId,
  initialData,   // null = tambah, object = edit
  onSave,
}) {
  const [form, setForm] = useState({
    mingguKe: "",
    tanggalCatat: "",
    jumlahBunga: "",
    bungaPecah: "",
    pentilMuncul: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!initialData;

  // helper untuk normalisasi tanggal ke YYYY-MM-DD (buat input type="date")
  const toYMD = (value) => {
    if (!value) return "";

    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [d, m, y] = value.split("/");
      return `${y}-${m}-${d}`;
    }

    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  // Prefill form kalau mode edit, reset kalau mode tambah
  useEffect(() => {
    if (!open) return;

    setError(null);

    if (initialData) {
      const backend = initialData.backend || initialData;

      const mingguKe =
        backend.minggu_ke ??
        backend.MingguKe ??
        initialData.mingguKe ??
        "";

      const rawTanggal =
        backend.tanggal_catat ??
        backend.TanggalCatat ??
        initialData.date ??
        "";

      const jumlahBunga =
        backend.jumlah_bunga ??
        backend.JumlahBunga ??
        initialData.munculBunga ??
        "";

      const bungaPecah =
        backend.bunga_pecah ??
        backend.BungaPecah ??
        initialData.pecahBunga ??
        "";

      const pentilMuncul =
        backend.pentil_muncul ??
        backend.PentilMuncul ??
        initialData.pentilPertama ??
        "";

      setForm({
        mingguKe: String(mingguKe ?? ""),
        tanggalCatat: toYMD(rawTanggal),
        jumlahBunga: String(jumlahBunga ?? ""),
        bungaPecah: String(bungaPecah ?? ""),
        pentilMuncul: String(pentilMuncul ?? ""),
      });
    } else {
      // mode tambah
      setForm({
        mingguKe: "",
        tanggalCatat: "",
        jumlahBunga: "",
        bungaPecah: "",
        pentilMuncul: "",
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
        minggu_ke: Number(form.mingguKe),
        tanggal_catat: form.tanggalCatat, // sudah yyyy-mm-dd
        jumlah_bunga: Number(form.jumlahBunga || 0),
        bunga_pecah: Number(form.bungaPecah || 0),
        pentil_muncul: Number(form.pentilMuncul || 0),
        tanaman_id: Number(plantId),
      };

      const token = localStorage.getItem("token");

      // --- bedakan Tambah vs Edit ---
      let url = "http://localhost:2005/api/v1/petani/fase-bunga";
      let method = "POST";

      if (isEdit) {
        const idFromRow =
          initialData.id ??
          initialData.backend?.ID ??
          initialData.backend?.id;
        url = `http://localhost:2005/api/v1/petani/fase-bunga/${idFromRow}`;
        method = "PUT"; // sesuaikan dengan route update di backend (PUT/PATCH)
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
      if (!res.ok) throw new Error(json.message || "Gagal menyimpan");

      onSave(json.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600"
        >
          <FaTimes />
        </button>

        <h2 className="text-lg font-semibold mb-1">
          {isEdit ? "Edit Fase Berbunga" : "Tambah Fase Berbunga"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm">Minggu Ke</label>
              <input
                type="number"
                name="mingguKe"
                value={form.mingguKe}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm">Tanggal Catat</label>
              <input
                type="date"
                name="tanggalCatat"
                value={form.tanggalCatat}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm">Jumlah Bunga</label>
              <input
                type="number"
                name="jumlahBunga"
                value={form.jumlahBunga}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm">Bunga Pecah</label>
              <input
                type="number"
                name="bungaPecah"
                value={form.bungaPecah}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Pentil Muncul</label>
            <input
              type="number"
              name="pentilMuncul"
              value={form.pentilMuncul}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {saving
                ? isEdit
                  ? "Menyimpan..."
                  : "Menyimpan..."
                : isEdit
                ? "Simpan Perubahan"
                : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
