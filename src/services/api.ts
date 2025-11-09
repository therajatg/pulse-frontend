import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      const { token } = JSON.parse(user);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (email: string, password: string, role?: string) =>
    api.post("/auth/register", { email, password, role }),

  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
};

// Video APIs
export const videoAPI = {
  upload: (formData: FormData, onProgress?: (progress: number) => void) =>
    api.post("/videos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    }),

  getAll: (filters?: { status?: string; sensitivity?: string }) =>
    api.get("/videos", { params: filters }),

  getOne: (id: string) => api.get(`/videos/${id}`),

  getStreamUrl: (id: string) => `${API_URL}/videos/stream/${id}`,
};

export default api;
