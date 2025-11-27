export const parseDMY = (str) => {
  const [d, m, y] = (str || "").split("/");
  if (!d || !m || !y) return null;
  const year = y.length === 2 ? 2000 + Number(y) : Number(y);
  const date = new Date(year, Number(m) - 1, Number(d));
  return isNaN(date.getTime()) ? null : date;
};

export const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

export const fmtDMY = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const toDMY = (input) => {
  if (!input) return "-";
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
