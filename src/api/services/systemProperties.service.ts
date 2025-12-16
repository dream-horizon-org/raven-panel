import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api";

export interface SystemProperty {
  propertyName: string;
  type: string;
  expectedValue: string;
  isMandatory: boolean;
  description: string;
}

export interface SystemPropertiesResponse {
  data:
    | SystemProperty[]
    | {
        names?: string[];
        properties?: string[];
        systemProperties?: string[];
      };
}

export const getSystemProperties = async ({
  signal,
}: { signal?: AbortSignal } = {}): Promise<SystemPropertiesResponse> => {
  const res = await axiosInstance.get<SystemPropertiesResponse>(
    API_ENDPOINTS.SYSTEM_PROPERTIES,
    {
      signal,
    }
  );
  return res.data;
};
