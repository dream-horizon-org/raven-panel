"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "@/api/services/permissions.service";
import { UserPermission } from "@/api/services/types/permissions.interface";

interface PermissionContextType {
  permissions: UserPermission[];
  userEmail: string | null;
  hasViewAccess: boolean;
  hasEditAccess: boolean;
  hasPublishAccess: boolean;
  isLoading: boolean;
  setUserEmailFromOutside: (email: string | null) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within PermissionProvider");
  }
  return context;
};

interface PermissionProviderProps {
  children: React.ReactNode;
}

const isPermissionEnabled = () => {
  const enablePermission = process.env.NEXT_PUBLIC_ENABLE_PERMISSION;
  return enablePermission === "true";
};

export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isEmailResolved, setIsEmailResolved] = useState(false);
  const permissionEnabled = isPermissionEnabled();

  useEffect(() => {
    console.log(
      "[PermissionProvider] useEffect: Reading user email from localStorage"
    );
    try {
      const userData = localStorage.getItem("google_user");
      console.log("[PermissionProvider] localStorage data:", {
        hasData: !!userData,
        dataLength: userData?.length || 0,
      });

      if (userData) {
        const user = JSON.parse(userData);
        const email = user.email || null;
        console.log("[PermissionProvider] User email extracted:", {
          email,
          hasEmail: !!email,
        });
        setUserEmail(email);
      } else {
        console.log("[PermissionProvider] No user data in localStorage");
        setUserEmail(null);
      }
    } catch (error) {
      console.error("[PermissionProvider] Error parsing user data:", {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      setUserEmail(null);
    } finally {
      console.log("[PermissionProvider] Email resolution complete");
      setIsEmailResolved(true);
    }
  }, []);

  const { data: permissions = [], isLoading: isPermissionsLoading } = useQuery<
    UserPermission[]
  >({
    queryKey: ["permissions", userEmail],
    queryFn: getPermissions,
    enabled: permissionEnabled && !!userEmail,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  console.log("[PermissionProvider] React Query state:", {
    permissionsCount: permissions.length,
    isPermissionsLoading,
    userEmail,
    permissionEnabled,
    queryEnabled: permissionEnabled && !!userEmail,
    hasPermissions: permissions.length > 0,
    samplePermissions: permissions.slice(0, 2),
  });

  const { hasViewAccess, hasEditAccess, hasPublishAccess } = useMemo(() => {
    console.log("[PermissionProvider] useMemo execution:", {
      permissionEnabled,
      isEmailResolved,
      isPermissionsLoading,
      userEmail,
      permissionsLength: permissions.length,
    });

    if (!permissionEnabled) {
      return {
        hasViewAccess: true,
        hasEditAccess: true,
        hasPublishAccess: true,
      };
    }

    if (!isEmailResolved || isPermissionsLoading || !userEmail) {
      console.log(
        "[PermissionProvider] Early return - permissions set to false:",
        {
          isEmailResolved,
          isPermissionsLoading,
          userEmail,
        }
      );
      return {
        hasViewAccess: false,
        hasEditAccess: false,
        hasPublishAccess: false,
      };
    }

    const isDream11Email = userEmail.endsWith("@dream11.com");
    const isFancodeEmail = userEmail.endsWith("@fancode.com");

    let hasViewAccess = isDream11Email || isFancodeEmail;
    let hasEditAccess = false;
    let hasPublishAccess = false;

    const normalizedUserEmail = userEmail.toLowerCase().trim();

    const userPermission = permissions.find((p) => {
      const normalizedPermissionUser = String(p.user)
        .toLowerCase()
        .trim();
      return normalizedPermissionUser === normalizedUserEmail;
    });

    if (userPermission) {
      const toBoolean = (value: unknown): boolean => {
        if (typeof value === "boolean") return value;
        if (typeof value === "string") {
          return value.toLowerCase() === "true";
        }
        return Boolean(value);
      };

      hasViewAccess = toBoolean(userPermission.view);
      hasEditAccess = toBoolean(userPermission.edit);
      hasPublishAccess = toBoolean(userPermission.publish);

      // Log permissions for all users
      console.log(
        `[PermissionProvider] ✅ User permissions resolved for ${normalizedUserEmail}:`,
        {
          userEmail: normalizedUserEmail,
          userPermission: userPermission,
          rawValues: {
            view: userPermission.view,
            edit: userPermission.edit,
            publish: userPermission.publish,
          },
          types: {
            viewType: typeof userPermission.view,
            editType: typeof userPermission.edit,
            publishType: typeof userPermission.publish,
          },
          convertedValues: {
            view: hasViewAccess,
            edit: hasEditAccess,
            publish: hasPublishAccess,
          },
        }
      );
    } else {
      console.warn(
        `[PermissionProvider] No permission entry found for user: ${normalizedUserEmail}. Available users:`,
        permissions.map((p) =>
          String(p.user)
            .toLowerCase()
            .trim()
        )
      );
    }

    return { hasViewAccess, hasEditAccess, hasPublishAccess };
  }, [
    permissions,
    userEmail,
    isEmailResolved,
    isPermissionsLoading,
    permissionEnabled,
  ]);

  const value: PermissionContextType = {
    permissions,
    userEmail,
    hasViewAccess,
    hasEditAccess,
    hasPublishAccess,
    isLoading: !permissionEnabled
      ? false
      : !isEmailResolved || isPermissionsLoading,
    setUserEmailFromOutside: setUserEmail,
  };

  // Log final context values for all users
  console.log("[PermissionProvider] ✅ FINAL CONTEXT VALUES:", {
    userEmail: value.userEmail,
    hasViewAccess: value.hasViewAccess,
    hasEditAccess: value.hasEditAccess,
    hasPublishAccess: value.hasPublishAccess,
    isLoading: value.isLoading,
    permissionsCount: value.permissions.length,
    typeOfHasEditAccess: typeof value.hasEditAccess,
    typeOfHasPublishAccess: typeof value.hasPublishAccess,
    typeOfHasViewAccess: typeof value.hasViewAccess,
    isEmailResolved,
    isPermissionsLoading,
    permissionEnabled,
  });

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};
