"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type TenantData = {
  id?: string | number;
  name?: string;
};

type MultiTenantContextType = {
  tenantData: TenantData;
  setTenantData: (data: TenantData) => void;
};

const MultiTenantContext = createContext<MultiTenantContextType | undefined>(
  undefined
);

export const useMultiTenant = () => {
  const context = useContext(MultiTenantContext);
  if (!context) {
    throw new Error("useMultiTenant must be used within MultiTenantProvider");
  }
  return context;
};

interface MultiTenantProviderProps {
  children: React.ReactNode;
}

export const MultiTenantProvider: React.FC<MultiTenantProviderProps> = ({
  children,
}) => {
  const [tenantData, setTenantData] = useState<TenantData>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem("tenantData");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error parsing tenantData from localStorage:", error);
      return {};
    }
  });

  const handleSetTenantData = (data: TenantData) => {
    setTenantData(data);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("tenantData", JSON.stringify(data));
      } catch (error) {
        console.error("Error saving tenantData to localStorage:", error);
      }
    }
  };

  return (
    <MultiTenantContext.Provider
      value={{ tenantData, setTenantData: handleSetTenantData }}
    >
      {children}
    </MultiTenantContext.Provider>
  );
};
