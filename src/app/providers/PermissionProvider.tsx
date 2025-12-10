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

export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isEmailResolved, setIsEmailResolved] = useState(false);

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
    enabled: !!userEmail,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  // 3) Compute effective access
  const { hasViewAccess, hasEditAccess, hasPublishAccess } = useMemo(() => {
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

    const userPermission = permissions.find(
      (p) => p.user.toLowerCase() === userEmail.toLowerCase()
    );

    if (userPermission) {
      hasViewAccess = userPermission.view;
      hasEditAccess = userPermission.edit;
      hasPublishAccess = userPermission.publish;
    }

    return { hasViewAccess, hasEditAccess, hasPublishAccess };
  }, [permissions, userEmail, isEmailResolved, isPermissionsLoading]);

  const value: PermissionContextType = {
    permissions,
    userEmail,
    hasViewAccess,
    hasEditAccess,
    hasPublishAccess,
    isLoading: !isEmailResolved || isPermissionsLoading,
    setUserEmailFromOutside: setUserEmail,
  };
  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};
