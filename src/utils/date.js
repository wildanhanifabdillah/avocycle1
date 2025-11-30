// -------------------------------
// 🔶 Parsing: "DD/MM/YYYY" → Date()
// -------------------------------
export const parseDMY = (str) => {
  const [d, m, y] = (str || "").split("/");
  if (!d || !m || !y) return null;

  const year = y.length === 2 ? 2000 + Number(y) : Number(y);
  const date = new Date(year, Number(m) - 1, Number(d));

  return isNaN(date.getTime()) ? null : date;
};

// -------------------------------
// 🔶 Add X months to Date object
// -------------------------------
export const addMonths = (date, months) => {
  if (!date) return null;
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

// -------------------------------
// 🔶 Format Date → "DD/MM/YYYY"
// -------------------------------
export const fmtDMY = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d)) return "-";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

// -------------------------------
// 🔶 Konversi format tanggal bahasa Indonesia → "DD/MM/YYYY"
// contoh: "21 Oktober 2024"
// -------------------------------
export const toDMY = (input) => {
  if (!input) return "-";

  // Sudah dalam format DMY
  if (input.includes("/")) return input;

  const bulan = {
    januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
    juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11
  };

  const bagian = input.toLowerCase().split(" ");
  if (bagian.length === 3) {
    const [d, m, y] = bagian;
    const bulanIndex = bulan[m];

    if (bulanIndex !== undefined) {
      const date = new Date(Number(y), bulanIndex, Number(d));
      if (!isNaN(date)) return fmtDMY(date);
    }
  }

  return input;
};

// -------------------------------
// 🔶 Format ISO / Raw date → "DD/MM/YYYY"
// Pengganti formatDMY lama
// -------------------------------
export const formatDMY = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d)) return "-";
  return fmtDMY(d);
};

// -------------------------------
// 🔶 Add X days to ISO date (existing function)
// -------------------------------
export const addDays = (iso, days) => {
  if (!iso || !days) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  d.setDate(d.getDate() + Number(days));
  return d;
};

// -------------------------------
// 🔶 Hitung selisih bulan dari tanggal tanam → sekarang
// -------------------------------
export const monthsDiffFrom = (iso) => {
  if (!iso) return 0;
  const d = new Date(iso);
  if (isNaN(d)) return 0;

  const now = new Date();
  let months =
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth() - d.getMonth());

  if (now.getDate() < d.getDate()) months -= 1;
  return Math.max(0, months);
};
