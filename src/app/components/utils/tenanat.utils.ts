export const getOrganizations = (): readonly string[] => {
  const orgsEnv = process.env.NEXT_PUBLIC_ORGANIZATIONS;
  console.log("orgsEnv", orgsEnv);
  if (orgsEnv) {
    const trimmed = orgsEnv.trim();
    // Check if it's a JSON array format: ["dream11", "criq"]
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed) as string[];
        if (Array.isArray(parsed)) {
          return parsed
            .map((org) => String(org).trim())
            .filter(Boolean) as readonly string[];
        }
      } catch (e) {
        console.warn("Failed to parse NEXT_PUBLIC_ORGANIZATIONS as JSON:", e);
      }
    }
    // Handle comma-separated format: dream11,criq
    if (trimmed.includes(",")) {
      return trimmed
        .split(",")
        .map((org) => org.trim())
        .filter(Boolean) as readonly string[];
    }
    // Handle space-separated format: dream11 criq
    return trimmed
      .split(/\s+/)
      .map((org) => org.trim())
      .filter(Boolean) as readonly string[];
  }
  return [""] as const;
};

/**
 * Get tenant from URL query parameters
 * Supports both ?tenant=value and ?=value formats
 */
export function getTenantFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const sp = new URLSearchParams(window.location.search);
  const t1 = sp.get("tenant");

  if (t1 !== null) return t1;

  const raw = window.location.search.replace(/^\?/, "");
  if (raw.startsWith("=")) return raw.slice(1) || null;

  return null;
}

/**
 * Build a URL with tenant query parameter
 */
export const buildTenantQueryUrl = (
  tenant: string,
  pathname: string = "/",
  search: string = ""
): string => {
  if (typeof window === "undefined") return pathname;

  const sp = new URLSearchParams(search);
  sp.set("tenant", tenant);
  const query = sp.toString();
  return `${window.location.origin}${pathname}?${query}`;
};

/**
 * Build pathname and search string with tenant
 */
export const buildPathWithTenant = (
  to: string,
  tenant?: string,
  currentSearch: string = typeof window !== "undefined"
    ? window.location.search
    : ""
): { pathname: string; search: string } => {
  let pathname = to;
  let nextSearch = new URLSearchParams(currentSearch);

  const qIdx = to.indexOf("?");
  if (qIdx !== -1) {
    pathname = to.slice(0, qIdx);
    nextSearch = new URLSearchParams(to.slice(qIdx));
  }

  if (tenant) {
    nextSearch.set("tenant", tenant);
  } else {
    nextSearch.delete("tenant");
  }

  const qs = nextSearch.toString();
  return { pathname, search: qs ? `?${qs}` : "" };
};
