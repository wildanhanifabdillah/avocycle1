import api from "../api/axiosInstance";

const toFormData = (payload) => {
  if (payload instanceof FormData) return payload;
  const fd = new FormData();
  Object.entries(payload || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    fd.append(k, v);
  });
  return fd;
};

const FaseService = {
  createBerbunga: async (payload) => {
    const res = await api.post("/petani/fase-bunga", payload);
    return res.data;
  },

  createBerbuah: async (payload) => {
    const res = await api.post("/petani/fase-berbuah", payload);
    return res.data;
  },

  createPanen: async (payload) => {
    const body = toFormData(payload);
    const res = await api.post("/petani/fase-panen", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

export default FaseService;
