import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";

const AuthService = {
  login: async (email, password) => {
    const res = await api.post(ENDPOINTS.LOGIN, { email, password });

    const { token, data } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data));

    return data;
  },

  registerPetani: async (payload) => {
    const res = await api.post(ENDPOINTS.REGISTER_PETANI, payload);
    return res.data; 
  },

  registerPembeli: async (payload) => {
    const res = await api.post(ENDPOINTS.REGISTER_PEMBELI, payload);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getUser: () => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  },

  getToken: () => localStorage.getItem("token"),

  isLoggedIn: () => Boolean(localStorage.getItem("token")),

  saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}
};

export default AuthService;
