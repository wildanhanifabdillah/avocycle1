import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

const BuahService = {
  getAll: () => api.get(ENDPOINTS.PETANI_BUAH),
  getById: (id) => api.get(ENDPOINTS.PETANI_BUAH_BY_ID(id)),
  getByTanaman: (id) => api.get(ENDPOINTS.PETANI_BUAH_BY_TANAMAN(id)),

  create: (data) => api.post(ENDPOINTS.PETANI_BUAH, data),
  update: (id, data) => api.put(ENDPOINTS.PETANI_BUAH_BY_ID(id), data),
  remove: (id) => api.delete(ENDPOINTS.PETANI_BUAH_BY_ID(id)),
};

export default BuahService;
