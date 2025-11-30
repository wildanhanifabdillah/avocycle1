import api from "../api/axiosInstance";

const toFormData = (payload) => {
  if (payload instanceof FormData) return payload;
  const fd = new FormData();
  Object.entries(payload || {}).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    fd.append(key, val);
  });
  return fd;
};

const TanamanService = {
  async listByKebun(kebunId, page, perPage) {
    const hasPagination =
      typeof page === "number" &&
      !Number.isNaN(page) &&
      typeof perPage === "number" &&
      !Number.isNaN(perPage);

    const res = await api.get(`/tanaman/by-kebun/${kebunId}`, {
      params: hasPagination ? { page, per_page: perPage } : undefined,
    });
    return res.data;
  },

  async detail(id) {
    const res = await api.get(`/tanaman/${id}`);
    return res.data;
  },

  async create(payload) {
    const body = toFormData(payload);
    const res = await api.post("/tanaman", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async update(id, payload) {
    const body = toFormData(payload);
    const res = await api.put(`/tanaman/${id}`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async remove(id) {
    const res = await api.delete(`/tanaman/${id}`);
    return res.data;
  },
};

export default TanamanService;
