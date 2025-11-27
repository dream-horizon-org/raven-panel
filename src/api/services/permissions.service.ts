import axiosInstance from "@/lib/axios";
import {
  PermissionsResponse,
  UserPermission,
} from "./types/permissions.interface";

export const getPermissions = async (): Promise<UserPermission[]> => {
  try {
    const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;
    const isProduction = env === "production";
    const isUAT = env === "uat";

    const PERMISSIONS_URL =
      isProduction || isUAT
        ? "https://raven.delivr.live/raven-permissions.json"
        : "/raven-permissions.json";

    const response = await axiosInstance.get<
      PermissionsResponse | UserPermission[]
    >(PERMISSIONS_URL);

    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return [];
  }
};
