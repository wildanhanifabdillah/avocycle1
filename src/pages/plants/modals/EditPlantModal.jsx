import { useState, useRef, useEffect } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaChevronDown,
  FaFolderOpen,
} from "react-icons/fa";

export default function EditPlantModal({
  onClose,
  initialData,
  kebunId,   // opsional, kalau mau kirim ke API
  onSave,    // ⬅️ sekarang namanya SAMA dengan di parent
}) {
  const [form, setForm] = useState({
    type: "",
    date: "",
    period: "",
    code: "",
    photo: null,
  });

  const fileRef = useRef(null);
  const dateRef = useRef(null);

  // helper: normalisasi ke yyyy-mm-dd
  const normalizeDateToIso = (value) => {
    if (!value) return "";

    // "2025-11-27T00:00:00Z"
    if (typeof value === "string" && value.includes("T")) {
      return value.split("T")[0];
    }

    // "dd/mm/yy" atau "dd/mm/yyyy"
    if (typeof value === "string" && value.includes("/")) {
      const [d, m, y] = value.split("/");
      if (!d || !m || !y) return "";

      let year = parseInt(y, 10);
      if (String(y).length === 2) {
        year = 2000 + year;
      }

      const dd = String(parseInt(d, 10)).padStart(2, "0");
      const mm = String(parseInt(m, 10)).padStart(2, "0");
      const yyyy = String(year).padStart(4, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    // sudah yyyy-mm-dd
    return value;
  };

  // isi form dari initialData
  useEffect(() => {
    if (!initialData) return;

    let type = initialData.type || "";
    if (!type && initialData.varietas) {
      type =
        initialData.varietas === "Var1"
          ? "mentega"
          : initialData.varietas === "Var2"
          ? "miki"
          : "";
    }

    setForm((s) => ({
      ...s,
      type,
      date: normalizeDateToIso(
        initialData.date ||
          initialData.tanggal_tanam ||
          initialData.TanggalTanam ||
          ""
      ),
      period:
        initialData.period ||
        initialData.masa_produksi ||
        initialData.MasaProduksi ||
        "",
      code:
        initialData.code ||
        initialData.kode_tanaman ||
        initialData.KodeTanaman ||
        "",
      photo: null,
    }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((s) => ({ ...s, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!initialData || (!initialData.id && !initialData.ID)) {
      alert("ID tanaman tidak ditemukan.");
      return;
    }

    const plantId = initialData.id ?? initialData.ID;
    const isoDate = normalizeDateToIso(form.date);

    try {
      const formData = new FormData();

      formData.append(
        "varietas",
        form.type === "mentega" ? "Var1" : form.type === "miki" ? "Var2" : ""
      );
      formData.append("tanggal_tanam", isoDate);
      formData.append("kode_tanaman", form.code);
      formData.append("masa_produksi", form.period);

      if (kebunId !== undefined && kebunId !== null) {
        formData.append("kebun_id", String(kebunId));
      }

      if (form.photo) {
        formData.append("foto_tanaman", form.photo);
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:2005/api/v1/tanaman/${plantId}`,
        {
          method: "PUT",
          body: formData,
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        }
      );

      let body = null;
      try {
        body = await response.json();
      } catch (_) {}

      if (!response.ok) {
        console.error("Update plant API error:", body);
        throw new Error(body?.message || "Gagal mengupdate tanaman.");
      }

      // payload untuk update FE (pakai data API kalau ada, fallback ke form)
      const updatedPayload =
        body?.data && typeof body.data === "object"
          ? {
              id: body.data.ID ?? body.data.id ?? plantId,
              type:
                body.data.varietas === "Var1"
                  ? "mentega"
                  : body.data.varietas === "Var2"
                  ? "miki"
                  : form.type,
              date:
                body.data.tanggal_tanam ||
                body.data.TanggalTanam ||
                isoDate,
              period:
                body.data.masa_produksi ||
                body.data.MasaProduksi ||
                form.period,
              code:
                body.data.kode_tanaman ||
                body.data.KodeTanaman ||
                form.code,
            }
          : {
              id: plantId,
              type: form.type,
              date: isoDate,
              period: form.period,
              code: form.code,
            };

      if (typeof onSave === "function") {
        onSave(updatedPayload);
      }

      alert("Tanaman berhasil diupdate.");
      onClose();
    } catch (err) {
      console.error("Failed to update plant:", err);
      alert(err.message || "Gagal mengupdate tanaman.");
    }
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
                    try {
                      el.click();
                    } catch (e) {
                      console.debug("Date input click fallback failed", e);
                    }
                  }
                }}
              >
                <FaCalendarAlt />
              </button>
            </div>
          </div>

          {/* Periode */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Periode (hari):</label>
            <div className="relative">
              <input
                type="number"
                name="period"
                value={form.period}
                onChange={handleChange}
                placeholder="Masa produksi (hari)"
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Kode Unik */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Kode Tanaman:</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Ketik kode unik tanaman"
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
                <p className="mt-2 truncate text-xs text-gray-600">
                  {form.photo.name}
                </p>
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
