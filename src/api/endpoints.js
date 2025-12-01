export const ENDPOINTS = {
  // Auth
  LOGIN: "/login",
  REGISTER_PETANI: "/register/petani",
  REGISTER_PEMBELI: "/register/pembeli",
  GOOGLE_PETANI: "/auth/google/petani",
  GOOGLE_PEMBELI: "/auth/google/pembeli",
  GOOGLE_CALLBACK_PETANI: "/auth/google/callback/petani",
  GOOGLE_CALLBACK_PEMBELI: "/auth/google/callback/pembeli",
  GOOGLE_COMPLETE_PETANI: "/auth/google/complete/petani",
  GOOGLE_COMPLETE_PEMBELI: "/auth/google/complete/pembeli",

  // Kebun
  KEBUN: "/kebun",

  // Tanaman
  TANAMAN: "/tanaman",
  TANAMAN_BY_ID: (id) => `/tanaman/${id}`,
  TANAMAN_BY_KEBUN: (id_kebun) => `/tanaman/by-kebun/${id_kebun}`,

  // Log Penyakit Tanaman
  LOG_PENYAKIT: "/Log-Penyakit-Tanaman",
  LOG_PENYAKIT_BY_ID: (id) => `/Log-Penyakit-Tanaman/${id}`,
  LOG_PENYAKIT_BY_TANAMAN: (id) =>
    `/Log-Penyakit-Tanaman/Tanaman/${id}`,

  // Buah (Petani Only)
  PETANI_BUAH: "/petani/buah",
  PETANI_BUAH_BY_ID: (id) => `/petani/buah/${id}`,
  PETANI_BUAH_BY_TANAMAN: (id) => `/petani/buah/by-tanaman/${id}`,

  // Deteksi Penyakit (Petani/Admin)
  DETEKSI_PENYAKIT: "/petamin/penyakit",
};
