import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

const TanamanService = {
  getAll: () => api.get(ENDPOINTS.TANAMAN),
  getById: (id) => api.get(ENDPOINTS.TANAMAN_BY_ID(id)),
  getByKebun: (id_kebun) => api.get(ENDPOINTS.TANAMAN_BY_KEBUN(id_kebun)),

  create: (data) => api.post(ENDPOINTS.TANAMAN, data),
  update: (id, data) => api.put(ENDPOINTS.TANAMAN_BY_ID(id), data),
  remove: (id) => api.delete(ENDPOINTS.TANAMAN_BY_ID(id)),
};

export default TanamanService;
