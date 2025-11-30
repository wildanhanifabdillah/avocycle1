import { useState, useEffect, useRef } from "react";
import TanamanService from "../../services/TanamanService";

export default function EditPlantModal({
  open,
  onClose,
  onSave,
  initialData,
  kebunId,
}) {
  const dateRef = useRef(null);
  // --- hooks harus SELALU di top-level ---
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama_tanaman: "",
    varietas: "Var1",
    tanggal_tanam: "",
    masa_produksi: "",
    kode_blok: "",
    kode_tanaman: "",
  });

  // --- isi ulang form hanya ketika modal dibuka ---
  useEffect(() => {
    if (!open) return; // tetap tidak return component, hanya stop efek

    setForm({
      nama_tanaman:
        initialData?.nama_tanaman ||
        initialData?.name ||
        initialData?.nama ||
        "",
      varietas: initialData?.type === "mentega" ? "Var1" : "Var2",
      tanggal_tanam: (initialData?.date || "").slice(0, 10),
      masa_produksi: initialData?.period || "",
      kode_blok: initialData?.kode_blok || initialData?.block || "",
      kode_tanaman: initialData?.code || "",
    });
  }, [open, initialData]);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const idNum = Number(kebunId ?? initialData?.kebunId ?? 0);

      const payload = {
        nama_tanaman: form.nama_tanaman,
        varietas: form.varietas,
        tanggal_tanam: form.tanggal_tanam,
        masa_produksi: Number(form.masa_produksi),
        kebun_id: idNum,
        kode_blok: form.kode_blok,
        kode_tanaman: form.kode_tanaman,

        // backup untuk BE golang yg snake_case / PascalCase
        NamaTanaman: form.nama_tanaman,
        Varietas: form.varietas,
        TanggalTanam: form.tanggal_tanam,
        MasaProduksi: Number(form.masa_produksi),
        KebunID: idNum,
        KodeBlok: form.kode_blok,
        KodeTanaman: form.kode_tanaman,
      };

      const updated = await TanamanService.update(initialData.id, payload);
      onSave?.(updated?.data ?? updated ?? payload);
      onClose?.();
    } catch (err) {
      console.error("Gagal update tanaman", err);
      alert("Gagal update tanaman");
    } finally {
      setLoading(false);
    }
  };

  // --- modal tidak dirender ketika open === false ---
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-lg">Edit Tanaman</h2>
        </div>

        {/* FORM */}
        <div className="space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Nama Tanaman"
            value={form.nama_tanaman}
            onChange={update("nama_tanaman")}
          />

          <select
            className="w-full border rounded-lg px-3 py-2 bg-white"
            value={form.varietas}
            onChange={update("varietas")}
          >
            <option value="Var1">Alpukat Mentega</option>
            <option value="Var2">Alpukat Miki</option>
          </select>

          <div className="relative">
            <input
              type="date"
              ref={dateRef}
              className="w-full border rounded-lg px-3 py-2 pr-10 no-native-date-icon"
              value={form.tanggal_tanam}
              onChange={update("tanggal_tanam")}
            />
            <img
              src="/icons/calendar.svg"
              alt=""
              className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() =>
                dateRef.current?.showPicker
                  ? dateRef.current.showPicker()
                  : dateRef.current?.click()
              }
            />
          </div>

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Masa Produksi (hari)"
            type="number"
            value={form.masa_produksi}
            onChange={update("masa_produksi")}
          />

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Kode Blok"
            value={form.kode_blok}
            onChange={update("kode_blok")}
          />

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Kode Tanaman"
            value={form.kode_tanaman}
            onChange={update("kode_tanaman")}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between pt-2">
          <button
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            Tutup
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
            onClick={handleUpdate}
            disabled={loading}
            type="button"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
