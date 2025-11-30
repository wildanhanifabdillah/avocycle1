import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function EditFasePanenModal({
  open,
  onClose,
  plantId,
  initialData, // null = tambah, isi = edit
  onSave,
}) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    tanggalPanenAktual: "",
    jumlahPanen: "",
    jumlahSampel: "",
    beratTotal: "",
    catatan: "",
  });

  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Helper: ambil YYYY-MM-DD dari berbagai bentuk tanggal
  const toYMD = (value) => {
    if (!value) return "";

    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }

    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!open) return;

    setError(null);
    setFile(null);

    if (initialData?.backend) {
      const b = initialData.backend;
      const rawDate =
        b.TanggalPanenAktual ??
        b.tanggal_panen_aktual ??
        b.tanggalPanenAktual;

      setForm({
        tanggalPanenAktual: toYMD(rawDate),
        jumlahPanen: String(b.JumlahPanen ?? b.jumlah_panen ?? ""),
        jumlahSampel: String(b.JumlahSampel ?? b.jumlah_sampel ?? ""),
        beratTotal: String(b.BeratTotal ?? b.berat_total ?? ""),
        catatan: b.Catatan ?? b.catatan ?? "",
      });
    } else {
      setForm({
        tanggalPanenAktual: "",
        jumlahPanen: "",
        jumlahSampel: "",
        beratTotal: "",
        catatan: "",
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

      const fd = new FormData();

      if (form.tanggalPanenAktual) {
        fd.append("tanggal_panen_aktual", form.tanggalPanenAktual);
      }
      if (form.jumlahPanen !== "") {
        fd.append("jumlah_panen", String(form.jumlahPanen));
      }
      if (form.jumlahSampel !== "") {
        fd.append("jumlah_sampel", String(form.jumlahSampel));
      }
      if (form.beratTotal !== "") {
        fd.append("berat_total", String(form.beratTotal));
      }
      if (form.catatan) {
        fd.append("catatan", form.catatan);
      }

      // Tanaman ID:
      // – create: wajib
      // – update: optional, tapi kita isi saja dengan plantId biar konsisten
      fd.append("tanaman_id", String(plantId));

      if (file) {
        fd.append("foto_panen", file);
      }

      const token = localStorage.getItem("token");

      const idFromBackend =
        initialData?.backend?.ID ?? initialData?.backend?.id;

      const url = isEdit
        ? `http://localhost:2005/api/v1/petani/fase-panen/${idFromBackend}`
        : "http://localhost:2005/api/v1/petani/fase-panen";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Gagal menyimpan fase panen");
      }

      onSave?.(json.data);
      onClose?.();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
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
          {isEdit ? "Edit Fase Panen" : "Tambah Fase Panen"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm">Tanggal Panen Aktual</label>
            <input
              type="date"
              name="tanggalPanenAktual"
              value={form.tanggalPanenAktual}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm">Jumlah Panen (buah)</label>
              <input
                type="number"
                name="jumlahPanen"
                value={form.jumlahPanen}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm">Jumlah Sampel</label>
              <input
                type="number"
                name="jumlahSampel"
                value={form.jumlahSampel}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Berat Total (Kg)</label>
            <input
              type="number"
              step="0.01"
              name="beratTotal"
              value={form.beratTotal}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm">Catatan</label>
            <textarea
              name="catatan"
              value={form.catatan}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Foto Panen (opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFile(f || null);
              }}
              className="text-sm"
            />
            {initialData?.fotoPanen && (
              <p className="text-xs text-gray-500 mt-1">
                Foto saat ini:{" "}
                <a
                  href={initialData.fotoPanen}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-green-700"
                >
                  lihat foto
                </a>
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded text-sm"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
