import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

const KebunService = {
  getAll: () => api.get(ENDPOINTS.KEBUN),
  getById: (id) => api.get(`${ENDPOINTS.KEBUN}/${id}`),
  create: (data) => api.post(ENDPOINTS.KEBUN, data),
  update: (id, data) => api.put(`${ENDPOINTS.KEBUN}/${id}`, data),
  remove: (id) => api.delete(`${ENDPOINTS.KEBUN}/${id}`),
};

export default KebunService;
