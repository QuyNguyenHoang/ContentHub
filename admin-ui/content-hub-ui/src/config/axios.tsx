import axios from "axios";
import store from "../components/layouts/store/store";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST
axiosClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized");

      // Không redirect ở đây
      // Không refresh ở đây
      // Chỉ trả lỗi về component xử lý
    }

    return Promise.reject(error);
  },
);

export default axiosClient;