import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

export interface SystemPropertiesResponse {
  data: {
    names: string[];
    properties: string[];
    systemProperties: string[];
  };
}

export const getSystemProperties = async ({
  signal,
}: { signal?: AbortSignal } = {}): Promise<SystemPropertiesResponse> => {
  const res = await axiosInstance.get<SystemPropertiesResponse>(
    API_ENDPOINTS.SYSTEM_PROPERTIES,
    {
      params: { limit: 10000, companyName: "dream11", branchId: 0 },
      headers: { "x-tenant-id": "dream11", "x-skip-validation": "false" },
      signal,
    }
  );
  return res.data;
};
