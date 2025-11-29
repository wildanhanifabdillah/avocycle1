import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

const LogPenyakitService = {
  getAll: () => api.get(ENDPOINTS.LOG_PENYAKIT),
  getById: (id) => api.get(ENDPOINTS.LOG_PENYAKIT_BY_ID(id)),
  getByTanaman: (id) => api.get(ENDPOINTS.LOG_PENYAKIT_BY_TANAMAN(id)),
};

export default LogPenyakitService;
