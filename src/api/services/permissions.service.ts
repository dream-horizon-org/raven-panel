import axiosInstance from "@/lib/axios";
import {
  PermissionsResponse,
  UserPermission,
} from "./types/permissions.interface";

export const getPermissions = async (): Promise<UserPermission[]> => {
  try {
    const enablePermission = process.env.NEXT_PUBLIC_ENABLE_PERMISSION;
    if (enablePermission !== "true") {
      return [];
    }

    const PERMISSIONS_URL = process.env.NEXT_PUBLIC_PERMISSION_S3_URL;

    if (!PERMISSIONS_URL) {
      console.warn(
        "NEXT_PUBLIC_PERMISSION_S3_URL is not configured. Please set it in your environment variables."
      );
      return [];
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
