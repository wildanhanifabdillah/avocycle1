import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

const PenyakitService = {
  classify: (formData) => api.post(ENDPOINTS.DETEKSI_PENYAKIT, formData),
};

export default PenyakitService;
