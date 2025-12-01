import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:2005/api/v1",
  withCredentials: true,
});

// ambil token dari localStorage
const getToken = () => localStorage.getItem("token");

// REQUEST INTERCEPTOR → sisipkan token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// RESPONSE INTERCEPTOR → auto logout jika 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;