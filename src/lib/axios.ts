import axios from "axios";
import { API_AXIOS_CONFIG } from "@/config/api";

const axiosInstance = axios.create({
  timeout: API_AXIOS_CONFIG.timeout,
  headers: API_AXIOS_CONFIG.headers,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
