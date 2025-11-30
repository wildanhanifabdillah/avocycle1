import { fmtDMY } from "../utils/date";

export function mapTanaman(raw) {
  const id = raw.ID ?? raw.id;
  const varietas = raw.Varietas ?? raw.varietas;
  const tanggalTanam =
    raw.TanggalTanam ?? raw.tanggal_tanam ?? raw.tanggalTanam;

  return {
    id,
    code: raw.KodeTanaman ?? raw.kode_tanaman,
    type: varietas === "Var1" ? "mentega" : varietas === "Var2" ? "miki" : "other",
    date: tanggalTanam,
    period: raw.MasaProduksi ?? raw.masa_produksi,
    phase: "Fase Tumbuh",
    health: "Sehat",
    image: raw.FotoTanaman ?? raw.foto_tanaman ?? "/avocado1.png",
    fmtDate: tanggalTanam ? fmtDMY(new Date(tanggalTanam)) : "-",
  };
}

export function healthClass(status) {
  return status === "sakit"
    ? "border border-red-400 text-red-600 bg-red-50"
    : "border border-green-500 text-green-700 bg-green-50";
}

export function monthsDiff(dateIso) {
  if (!dateIso) return 0;
  const d = new Date(dateIso);
  const now = new Date();
  let months =
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth() - d.getMonth());
  if (now.getDate() < d.getDate()) months--;
  return Math.max(0, months);
}

export function estimate(dateIso, days) {
  const d = new Date(dateIso);
  d.setDate(d.getDate() + Number(days));
  return fmtDMY(d);
}
