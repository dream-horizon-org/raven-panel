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
    try {
      const userData = localStorage.getItem("google_user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserEmail(user.email || null);
      } else {
        setUserEmail(null);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUserEmail(null);
    } finally {
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

  const { hasViewAccess, hasEditAccess, hasPublishAccess } = useMemo(() => {
    if (!permissionEnabled) {
      return {
        hasViewAccess: true,
        hasEditAccess: true,
        hasPublishAccess: true,
      };
    }

    if (!isEmailResolved || isPermissionsLoading || !userEmail) {
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
  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};
