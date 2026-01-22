import axios from "axios";
import { API_AXIOS_CONFIG } from "@/config/api";
import { getOrganizations } from "@/app/components/utils/tenanat.utils";

const axiosInstance = axios.create({
  timeout: API_AXIOS_CONFIG.timeout,
  headers: API_AXIOS_CONFIG.headers,
});

const buildTenantConfig = (): Record<string, { source: string }> => {
  const organizations = getOrganizations();
  const config: Record<string, { source: string }> = {};

  organizations.forEach((org) => {
    if (org) {
      config[org] = { source: org };
    }
  });

  return config;
};

const TENANT_CONFIG = buildTenantConfig();

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== "undefined") {
        const storedTenant = localStorage.getItem("tenantData");
        const tenantData = storedTenant ? JSON.parse(storedTenant) : {};
        const tenantId = (tenantData?.name || tenantData?.id) as string;

        const tenantConfig = TENANT_CONFIG[tenantId];

        if (!tenantConfig) {
          console.warn(
            `Tenant "${tenantId}" not found in TENANT_CONFIG. Available tenants:`,
            Object.keys(TENANT_CONFIG)
          );
          return config;
        }

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
