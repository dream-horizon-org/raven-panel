"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useMultiTenant } from "@/app/providers/MultiTenantProvider";
import { buildPathWithTenant } from "@/app/components/utils/tenanat.utils";

/**
 * Persists tenant in URL
 * Ensures tenant query param is always present in URL (except auth routes)
 */
export const AppTenantPersist = () => {
  const { tenantData } = useMultiTenant();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const lastApplied = useRef<string>("");

  useEffect(() => {
    const tenant = tenantData?.name;

    if (!tenant) return;

    const path = pathname;
    const isAuthRoute =
      path.startsWith("/login") ||
      path.startsWith("/register") ||
      path.startsWith("/auth/callback") ||
      path === "/";

    if (isAuthRoute) return;

    const currentSearch = searchParams.toString();
    const existing = searchParams.get("tenant");

    if (existing === tenant && lastApplied.current === currentSearch) return;

    if (existing !== tenant) {
      const { pathname: newPathname, search: newSearch } = buildPathWithTenant(
        path,
        tenant,
        currentSearch
      );

      const fullPath = `${newPathname}${newSearch}`;
      const currentFullPath = `${pathname}${
        currentSearch ? `?${currentSearch}` : ""
      }`;

      if (fullPath !== currentFullPath) {
        lastApplied.current = newSearch.replace(/^\?/, "");
        router.replace(fullPath);
      }
    } else {
      lastApplied.current = currentSearch;
    }
  }, [pathname, searchParams, tenantData?.name, router]);

  return null;
};
