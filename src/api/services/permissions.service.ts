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
      PermissionsResponse | UserPermission[] | string
    >(PERMISSIONS_URL);

    console.log("[getPermissions] ✅ API response received:", {
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data,
      dataType: Array.isArray(response.data) ? "array" : typeof response.data,
      dataLength: Array.isArray(response.data) ? response.data.length : "N/A",
      responseHeaders: response.headers,
      contentType:
        response.headers?.["content-type"] ||
        response.headers?.["Content-Type"],
    });

    let permissions: UserPermission[] = [];
    let parsedData: unknown = response.data;

    // Handle case where response.data is a JSON string (needs parsing)
    if (typeof response.data === "string") {
      console.log(
        "[getPermissions] 🔄 Response is string, attempting to parse JSON..."
      );
      try {
        parsedData = JSON.parse(response.data);
        console.log("[getPermissions] ✅ Successfully parsed JSON string:", {
          parsedType: Array.isArray(parsedData) ? "array" : typeof parsedData,
          parsedLength: Array.isArray(parsedData) ? parsedData.length : "N/A",
        });
      } catch (parseError) {
        const stringPreview =
          typeof response.data === "string"
            ? response.data.substring(0, 200)
            : String(response.data).substring(0, 200);
        console.error("[getPermissions] ❌ Failed to parse JSON string:", {
          error: parseError,
          errorMessage:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
          stringPreview,
        });
        return [];
      }
    }

    // Handle different response formats after parsing
    if (Array.isArray(parsedData)) {
      permissions = parsedData;
      console.log(
        "[getPermissions] ✅ Response is array format, length:",
        permissions.length
      );
    } else if (
      parsedData &&
      typeof parsedData === "object" &&
      "data" in parsedData &&
      Array.isArray((parsedData as { data: unknown }).data)
    ) {
      permissions = (parsedData as { data: UserPermission[] }).data;
      console.log(
        "[getPermissions] ✅ Response is wrapped format, length:",
        permissions.length
      );
    } else {
      console.warn("[getPermissions] ⚠️ Unexpected response format:", {
        parsedData,
        dataType: typeof parsedData,
        dataKeys:
          parsedData && typeof parsedData === "object"
            ? Object.keys(parsedData)
            : [],
        originalDataType: typeof response.data,
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
