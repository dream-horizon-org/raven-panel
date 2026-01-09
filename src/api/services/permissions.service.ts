import axiosInstance from "@/lib/axios";
import {
  PermissionsResponse,
  UserPermission,
} from "./types/permissions.interface";

export const getPermissions = async (): Promise<UserPermission[]> => {
  const startTime = Date.now();
  console.log("[getPermissions] 🚀 Starting permissions fetch...");

  try {
    const enablePermission = process.env.NEXT_PUBLIC_ENABLE_PERMISSION;
    console.log("[getPermissions] Permission enabled check:", {
      enablePermission,
      isEnabled: enablePermission === "true",
    });

    if (enablePermission !== "true") {
      console.log(
        "[getPermissions] Permissions disabled, returning empty array"
      );
      return [];
    }

    const PERMISSIONS_URL = process.env.NEXT_PUBLIC_PERMISSION_S3_URL;
    console.log("[getPermissions] Permissions URL:", {
      PERMISSIONS_URL,
      hasUrl: !!PERMISSIONS_URL,
    });

    if (!PERMISSIONS_URL) {
      console.warn(
        "[getPermissions] ⚠️ NEXT_PUBLIC_PERMISSION_S3_URL is not configured. Please set it in your environment variables."
      );
      return [];
    }

    console.log("[getPermissions] 📡 Making API call to:", PERMISSIONS_URL);
    const response = await axiosInstance.get<
      PermissionsResponse | UserPermission[]
    >(PERMISSIONS_URL);

    console.log("[getPermissions] ✅ API response received:", {
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data,
      dataType: Array.isArray(response.data) ? "array" : typeof response.data,
      dataLength: Array.isArray(response.data) ? response.data.length : "N/A",
      responseHeaders: response.headers,
    });

    let permissions: UserPermission[] = [];

    // Handle different response formats
    if (Array.isArray(response.data)) {
      permissions = response.data;
      console.log(
        "[getPermissions] ✅ Response is array format, length:",
        permissions.length
      );
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      permissions = response.data.data;
      console.log(
        "[getPermissions] ✅ Response is wrapped format, length:",
        permissions.length
      );
    } else {
      console.warn("[getPermissions] ⚠️ Unexpected response format:", {
        data: response.data,
        dataType: typeof response.data,
        dataKeys:
          response.data && typeof response.data === "object"
            ? Object.keys(response.data)
            : [],
      });
    }

    // Log all users and their permissions for debugging
    console.log("[getPermissions] 📋 All users and permissions:", {
      totalPermissions: permissions.length,
      allUsers: permissions.map((p) => ({
        user: p.user,
        view: p.view,
        edit: p.edit,
        publish: p.publish,
      })),
    });

    // Validate permissions structure
    const invalidPermissions = permissions.filter(
      (p) =>
        typeof p.view !== "boolean" ||
        typeof p.edit !== "boolean" ||
        typeof p.publish !== "boolean"
    );
    if (invalidPermissions.length > 0) {
      console.warn(
        "[getPermissions] ⚠️ Found permissions with non-boolean values:",
        {
          count: invalidPermissions.length,
          examples: invalidPermissions.slice(0, 3),
        }
      );
    }

    const duration = Date.now() - startTime;
    console.log("[getPermissions] ✅ Permissions fetched successfully:", {
      count: permissions.length,
      duration: `${duration}ms`,
      sampleUsers: permissions.slice(0, 3).map((p) => ({
        user: p.user,
        view: p.view,
        edit: p.edit,
        publish: p.publish,
      })),
    });

    return permissions;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("[getPermissions] ❌ Error fetching permissions:", {
      error,
      duration: `${duration}ms`,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.name : undefined,
    });
    return [];
  }
};
