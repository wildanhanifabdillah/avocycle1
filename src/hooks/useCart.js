import { useCallback, useEffect, useMemo, useState } from "react";
import BookingService from "../services/BookingService";
import { monthsDiff, estimate } from "../helpers/plantUtils";
import { formatDMY } from "../utils/date";

const normalizeDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const decodeJwtPayload = (token) => {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadPart = parts[1];
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "===".slice((normalized.length + 3) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch (err) {
    console.warn("Failed to decode JWT:", err);
    return null;
  }
};

const resolveUserId = () => {
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const user = JSON.parse(rawUser);
      const cand =
        user?.id ??
        user?.ID ??
        user?.user_id ??
        user?.userId ??
        user?.UserID ??
        user?.IDUser;
      if (cand) return cand;
    }
  } catch {
    // ignore parse errors
  }

  const token = localStorage.getItem("token");
  if (token) {
    const payload = decodeJwtPayload(token);
    const cand =
      payload?.id ??
      payload?.ID ??
      payload?.user_id ??
      payload?.userId ??
      payload?.UserID ??
      payload?.sub;
    if (cand) return cand;
  }

  return null;
};

const mapBookingItem = (raw) => {
  const booking = raw?.booking ?? raw ?? {};
  const plant =
    booking?.tanaman ??
    booking?.tanaman_detail ??
    booking?.tanamanDetail ??
    booking?.plant ??
    booking?.pohon ??
    {};

  const plantedDate =
    normalizeDate(
      booking?.tanggal_tanam ??
        booking?.TanggalTanam ??
        booking?.tanaman_tanggal_tanam ??
        booking?.tanamanTanggalTanam ??
        plant?.TanggalTanam ??
        plant?.tanggal_tanam ??
        plant?.tanggalTanam ??
        plant?.planted_at ??
        plant?.plantedAt
    ) || "";

  const masaProduksi =
    booking?.masa_produksi ??
    booking?.masaProduksi ??
    plant?.masa_produksi ??
    plant?.MasaProduksi ??
    plant?.masaProduksi ??
    plant?.period ??
    plant?.periode;

  const estPanenRaw =
    booking?.estimasi_panen ??
    booking?.estimasiPanen ??
    booking?.estimated_harvest ??
    booking?.estimatedHarvest ??
    plant?.estimasi_panen ??
    plant?.estimasiPanen;

  const panenActual =
    booking?.tanggal_panen ??
    booking?.tanggalPanen ??
    booking?.tanggal_panen_aktual ??
    booking?.tanggalPanenAktual ??
    booking?.harvest_date ??
    booking?.harvestDate ??
    estPanenRaw;

  const plantId =
    booking?.tanaman_id ??
    booking?.TanamanID ??
    booking?.tanamanId ??
    booking?.plant_id ??
    booking?.plantId ??
    booking?.pohon_id ??
    booking?.pohonId ??
    plant?.id ??
    plant?.ID ??
    null;

  const kebunId =
    booking?.kebun_id ?? booking?.kebunId ?? plant?.kebun_id ?? plant?.kebunId;

  const code =
    booking?.kode_tanaman ??
    booking?.KodeTanaman ??
    plant?.kode_tanaman ??
    plant?.KodeTanaman ??
    plant?.code ??
    booking?.code ??
    `Pohon ${booking?.id ?? plantId ?? ""}`;

  return {
    id: booking?.ID ?? booking?.id ?? plantId ?? code,
    plantId,
    kebunId,
    code,
    ageMonths: plantedDate ? monthsDiff(plantedDate) : 0,
    phase:
      booking?.fase ??
      booking?.phase ??
      booking?.status ??
      plant?.fase ??
      plant?.phase ??
      "Fase Berbuah",
    harvestDate: panenActual ? formatDMY(panenActual) : "-",
    estimateDate:
      estPanenRaw && !Number.isNaN(new Date(estPanenRaw))
        ? formatDMY(estPanenRaw)
        : plantedDate && masaProduksi
        ? estimate(plantedDate, masaProduksi)
        : "-",
    image:
      plant?.foto_tanaman ??
      plant?.FotoTanaman ??
      plant?.image ??
      booking?.image ??
      "/avocado1.png",
    plantedDate,
  };
};

export default function useCart() {
  const userId = useMemo(resolveUserId, []);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setError("User tidak ditemukan, silakan login ulang.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await BookingService.listByUser(userId);
      const list = res?.data ?? res ?? [];
      setBookings(list.map(mapBookingItem));
    } catch (err) {
      console.error("Fetch booking error:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Gagal memuat data booking";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const deleteBooking = useCallback(
    async (bookingId) => {
      if (!bookingId) return;
      await BookingService.remove(bookingId);
      setBookings((prev) => prev.filter((item) => item.id !== bookingId));
    },
    []
  );

  return {
    bookings,
    loading,
    error,
    userId,
    reload: fetchBookings,
    deleteBooking,
  };
}
