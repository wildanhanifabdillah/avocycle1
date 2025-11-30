import api from "../api/axiosInstance";

const LogPenyakitService = {
  // LIST (paginated)
  getAllLogs: async (page = 1, perPage = 10) => {
    const res = await api.get(`/Log-Penyakit-Tanaman`, {
      params: { page, perPage }
    });

    return {
      data: res.data.data || [],
      meta: res.data.meta || {}
    };
  },

  // DETAIL
  getLogDetail: async (id) => {
    const res = await api.get(`/Log-Penyakit-Tanaman/${id}`);
    return res.data.data;
  },

  // LIST BY TANAMAN
  getByTanaman: async (tanamanId) => {
    const res = await api.get(`/Log-Penyakit-Tanaman/Tanaman/${tanamanId}`);
    return res.data.data || [];
  }
};

export default LogPenyakitService;
