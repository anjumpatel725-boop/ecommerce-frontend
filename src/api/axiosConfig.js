import api from "../api/axiosConfig";

api.get("/api/admin/orders")

const api = axios.create({
  baseURL: "https://ecommerce-backend-production-075f.up.railway.app"
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;