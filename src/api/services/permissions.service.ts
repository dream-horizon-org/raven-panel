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

    let PERMISSIONS_URL = "/raven-permissions.json";

    if (isProduction || isUAT) {
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        PERMISSIONS_URL = `https://${hostname}/raven-permissions.json`;
      } else {
        PERMISSIONS_URL = "https://raven.horizonos.in/raven-permissions.json";
      }
    }

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
