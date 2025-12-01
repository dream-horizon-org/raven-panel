import axios from "axios";
import { API_AXIOS_CONFIG } from "@/config/api";

const axiosInstance = axios.create({
  timeout: API_AXIOS_CONFIG.timeout,
  headers: API_AXIOS_CONFIG.headers,
});

const TENANT_CONFIG: Record<string, { source: string }> = {
  dream11: { source: "dream11" },
  criq: { source: "criq" },
};

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== "undefined") {
        const storedTenant = localStorage.getItem("tenantData");
        const tenantData = storedTenant ? JSON.parse(storedTenant) : {};
        const tenantId = (tenantData?.name ||
          tenantData?.id ||
          "dream11") as string;

        const tenantConfig = TENANT_CONFIG[tenantId] || TENANT_CONFIG.dream11;

        if (config.headers) {
          config.headers["x-tenant-id"] = tenantConfig.source;
        }
      }
    } catch (err) {
      console.warn("Failed to attach tenant/env headers", err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
