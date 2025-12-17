"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMultiTenant } from "@/app/providers/MultiTenantProvider";
import { getTenantFromUrl } from "@/app/components/utils/tenanat.utils";
import { TENANTS } from "./constants";

export const AppTenantSync = () => {
  const { tenantData, setTenantData } = useMultiTenant();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlTenant = getTenantFromUrl();

    if (!urlTenant) return;

    const match = TENANTS.find(
      (tenant) => tenant.name?.toLowerCase() === urlTenant.toLowerCase()
    );

    if (match && match.name !== tenantData?.name) {
      setTenantData({ name: match.name });
    } else if (!match && tenantData?.name !== urlTenant) {
      setTenantData({ name: urlTenant });
    }
  }, [pathname, searchParams, tenantData?.name, setTenantData]);

  return null;
};
