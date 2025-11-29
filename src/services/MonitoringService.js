import api from "../api/axiosInstance";

const MonitoringService = {
  classify: async (file) => {
    const form = new FormData();
    form.append("image", file);

    const res = await api.post("/petamin/penyakit", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data; // { message, data: {...} }
  },

  saveLog: async (payload) => {
    return await api.post("/Log-Penyakit-Tanaman", payload);
  },

  getHistory: async () => {
    const res = await api.get("/Log-Penyakit-Tanaman");
    return res.data.data || [];
  },
};

export default MonitoringService;
