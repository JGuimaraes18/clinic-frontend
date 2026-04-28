import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// =============================
// REQUEST INTERCEPTOR
// =============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =============================
// RESPONSE INTERCEPTOR
// =============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Se for 401 e não estiver já na tela de login
    if (status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;