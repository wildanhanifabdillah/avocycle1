import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

const DashboardService = {
  getCountPohon: async () => {
    const res = await api.get(ENDPOINTS.DASHBOARD_COUNT_POHON);
    return res.data?.data ?? res.data ?? 0;
  },

  getCountSakit: async () => {
    const res = await api.get(ENDPOINTS.DASHBOARD_COUNT_SAKIT);
    return res.data?.data ?? res.data ?? 0;
  },

  getCountSiapPanen: async () => {
    const res = await api.get(ENDPOINTS.DASHBOARD_COUNT_SIAP_PANEN);
    return res.data?.data ?? res.data ?? 0;
  },

  getWeeklyPanen: async () => {
    const res = await api.get(ENDPOINTS.DASHBOARD_CHART_PANEN);
    return res.data?.data ?? res.data ?? [];
  },
};

export default DashboardService;

