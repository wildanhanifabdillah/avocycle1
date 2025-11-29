import api from "../api/axiosInstance";

const KebunService = {
  getAll: async () => {
    const res = await api.get(`/kebun`);
    return res.data; // harus array
  },

  create: async (payload) => {
    const res = await api.post("/kebun", payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/kebun/${id}`, payload);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/kebun/${id}`);
    return res.data;
  },
};

export default KebunService;
