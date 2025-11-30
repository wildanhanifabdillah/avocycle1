import api from "../api/axiosInstance";

const MonitoringService = {
  /**
   * 1) Kirim gambar ke AI Deteksi Penyakit
   * endpoint: POST /petamin/penyakit/:id_tanaman
   */
  classify: async (file, plantId) => {
    const form = new FormData();
    form.append("foto_tanaman", file); // WAJIB sesuai backend

    const res = await api.post(`/petamin/penyakit/${plantId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data; // langsung return object {nama_penyakit, deskripsi, kondisi, saran_perawatan, log}
  },

  /**
   * 2) Simpan hasil analisis ke Log Penyakit Tanaman
   */
  saveLog: async (payload) => {
    const res = await api.post("/Log-Penyakit-Tanaman", payload);
    return res.data.data;
  },

  /**
   * 3) Ambil semua log penyakit
   */
  getHistory: async () => {
    const res = await api.get("/Log-Penyakit-Tanaman");
    return res.data.data || [];
  },

  /**
   * 4) Ambil list tanaman
   */
  getPlants: async () => {
    const res = await api.get("/tanaman");
    return res.data.data || [];
  },
};

export default MonitoringService;
