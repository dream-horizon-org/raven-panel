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

export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Get user email from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("google_user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserEmail(user.email || null);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  // Fetch permissions
  const { data: permissions = [], isLoading } = useQuery<UserPermission[]>({
    queryKey: ["permissions"],
    queryFn: getPermissions,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Calculate user permissions
  const userPermissions = useMemo(() => {
    if (!userEmail) {
      return {
        hasViewAccess: false,
        hasEditAccess: false,
        hasPublishAccess: false,
      };
    }

    // Default: All @dream11.com and @ffancode.com emails have view access
    const isDream11Email = userEmail.endsWith("@dream11.com");
    const isFancodeEmail =
      userEmail.endsWith("@fancode.com") || userEmail.endsWith("@fancode.com");
    let hasViewAccess = isDream11Email || isFancodeEmail;
    let hasEditAccess = false;
    let hasPublishAccess = false;

    // Find user's specific permissions
    // Match by email (user field can be email or name)
    const userPermission = permissions.find(
      (p) => p.user.toLowerCase() === userEmail.toLowerCase()
    );

    if (userPermission) {
      hasViewAccess = userPermission.view;
      hasEditAccess = userPermission.edit;
      hasPublishAccess = userPermission.publish;
    }

    return {
      hasViewAccess,
      hasEditAccess,
      hasPublishAccess,
    };
  }, [permissions, userEmail]);

  const value: PermissionContextType = {
    permissions,
    userEmail,
    ...userPermissions,
    isLoading,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};
