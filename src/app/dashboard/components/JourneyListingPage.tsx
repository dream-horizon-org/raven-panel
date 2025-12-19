"use client";

import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchAndFilters from "./SearchAndFilters";
import JourneysTable from "./JourneysTable";
import StatusTabs, { Status, StatusCounts } from "./StatusTab";
import {
  bodyContainerStyles,
  bodyContentStyles,
  bodyInnerStyles,
  headerSectionStyles,
  titleStyles,
  createButtonStyles,
  headerActionsContainerStyles,
  searchContainerWrapperStyles,
} from "./styles/bodyStyles";
import { BUTTON_TEXT, PAGE_TITLES } from "@/config/constants";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useJourneysList } from "@/app/dashboard/hooks/useJourneysList";
import { usePermissions } from "@/app/providers/PermissionProvider";

export default function JourneyListingPage() {
  // ============================================
  // Environment Variables Console Logs
  // ============================================
  console.log("=== Environment Variables ===");
  console.log("NEXT_PUBLIC_ENV:", process.env.NEXT_PUBLIC_ENV);
  console.log("NODE_ENV:", process.env.NODE_ENV);

  // ============================================
  // Google OAuth Configuration
  // ============================================
  console.log(
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID:",
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  );
  console.log(
    "NEXT_PUBLIC_GOOGLE_CLIENT_SECRET:",
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
  );

  // ============================================
  // Base URL Configuration
  // ============================================
  console.log(
    "NEXT_PUBLIC_PRODUCTION_URL:",
    process.env.NEXT_PUBLIC_PRODUCTION_URL
  );
  console.log("NEXT_PUBLIC_UAT_URL:", process.env.NEXT_PUBLIC_UAT_URL);
  console.log(
    "NEXT_PUBLIC_BASE_URL_PROD:",
    process.env.NEXT_PUBLIC_BASE_URL_PROD
  );
  console.log(
    "NEXT_PUBLIC_BASE_URL_UAT:",
    process.env.NEXT_PUBLIC_BASE_URL_UAT
  );

  // ============================================
  // Login Configuration
  // ============================================
  console.log(
    "NEXT_PUBLIC_IS_LOGIN_ENABLED:",
    process.env.NEXT_PUBLIC_IS_LOGIN_ENABLED
  );

  // ============================================
  // Cohort Configuration (API)
  // ============================================
  console.log(
    "NEXT_PUBLIC_ENABLE_COHORT:",
    process.env.NEXT_PUBLIC_ENABLE_COHORT
  );
  console.log(
    "NEXT_PUBLIC_COHORT_URL_PROD:",
    process.env.NEXT_PUBLIC_COHORT_URL_PROD
  );
  console.log(
    "NEXT_PUBLIC_COHORT_URL_UAT:",
    process.env.NEXT_PUBLIC_COHORT_URL_UAT
  );

  // ============================================
  // Event Configuration (API)
  // ============================================
  console.log(
    "NEXT_PUBLIC_EVENT_URL_PROD:",
    process.env.NEXT_PUBLIC_EVENT_URL_PROD
  );
  console.log(
    "NEXT_PUBLIC_EVENT_URL_UAT:",
    process.env.NEXT_PUBLIC_EVENT_URL_UAT
  );

  // ============================================
  // System Properties Configuration (API)
  // ============================================
  console.log(
    "NEXT_PUBLIC_SYSTEM_PROPERTIES_URL:",
    process.env.NEXT_PUBLIC_SYSTEM_PROPERTIES_URL
  );

  // ============================================
  // Permission Configuration (JSON File)
  // ============================================
  console.log(
    "NEXT_PUBLIC_ENABLE_PERMISSION:",
    process.env.NEXT_PUBLIC_ENABLE_PERMISSION
  );
  console.log(
    "NEXT_PUBLIC_PERMISSION_S3_URL:",
    process.env.NEXT_PUBLIC_PERMISSION_S3_URL
  );

  // ============================================
  // Tenant Configuration (Dropdown Options)
  // ============================================
  console.log(
    "NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT:",
    process.env.NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT
  );
  console.log(
    "NEXT_PUBLIC_ORGANIZATIONS:",
    process.env.NEXT_PUBLIC_ORGANIZATIONS
  );

  console.log("=== End Environment Variables ===\n");
  // ============================================
  // Environment Variables Console Logs
  // ============================================
  console.log("=== Environment Variables ===");
  console.log("NEXT_PUBLIC_ENV:", process.env.NEXT_PUBLIC_ENV);
  console.log("NODE_ENV:", process.env.NODE_ENV);

  // ============================================
  // Google OAuth Configuration
  // ============================================
  console.log(
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID:",
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  );
  console.log(
    "NEXT_PUBLIC_GOOGLE_CLIENT_SECRET:",
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
  );

  // ============================================
  // Base URL Configuration
  // ============================================
  console.log(
    "NEXT_PUBLIC_PRODUCTION_URL:",
    process.env.NEXT_PUBLIC_PRODUCTION_URL
  );
  console.log("NEXT_PUBLIC_UAT_URL:", process.env.NEXT_PUBLIC_UAT_URL);
  console.log(
    "NEXT_PUBLIC_BASE_URL_PROD:",
    process.env.NEXT_PUBLIC_BASE_URL_PROD
  );
  console.log(
    "NEXT_PUBLIC_BASE_URL_UAT:",
    process.env.NEXT_PUBLIC_BASE_URL_UAT
  );

  // ============================================
  // Login Configuration
  // ============================================
  console.log(
    "NEXT_PUBLIC_IS_LOGIN_ENABLED:",
    process.env.NEXT_PUBLIC_IS_LOGIN_ENABLED
  );

  // ============================================
  // Cohort Configuration (API)
  // ============================================
  console.log(
    "NEXT_PUBLIC_ENABLE_COHORT:",
    process.env.NEXT_PUBLIC_ENABLE_COHORT
  );
  console.log(
    "NEXT_PUBLIC_COHORT_URL_PROD:",
    process.env.NEXT_PUBLIC_COHORT_URL_PROD
  );
  console.log(
    "NEXT_PUBLIC_COHORT_URL_UAT:",
    process.env.NEXT_PUBLIC_COHORT_URL_UAT
  );

  // ============================================
  // Event Configuration (API)
  // ============================================
  console.log(
    "NEXT_PUBLIC_EVENT_URL_PROD:",
    process.env.NEXT_PUBLIC_EVENT_URL_PROD
  );
  console.log(
    "NEXT_PUBLIC_EVENT_URL_UAT:",
    process.env.NEXT_PUBLIC_EVENT_URL_UAT
  );

  // ============================================
  // System Properties Configuration (API)
  // ============================================
  console.log(
    "NEXT_PUBLIC_SYSTEM_PROPERTIES_URL:",
    process.env.NEXT_PUBLIC_SYSTEM_PROPERTIES_URL
  );

  // ============================================
  // Permission Configuration (JSON File)
  // ============================================
  console.log(
    "NEXT_PUBLIC_ENABLE_PERMISSION:",
    process.env.NEXT_PUBLIC_ENABLE_PERMISSION
  );
  console.log(
    "NEXT_PUBLIC_PERMISSION_S3_URL:",
    process.env.NEXT_PUBLIC_PERMISSION_S3_URL
  );

  // ============================================
  // Tenant Configuration (Dropdown Options)
  // ============================================
  console.log(
    "NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT:",
    process.env.NEXT_PUBLIC_ORGANIZATIONS_ENABLE_TENANT
  );
  console.log(
    "NEXT_PUBLIC_ORGANIZATIONS:",
    process.env.NEXT_PUBLIC_ORGANIZATIONS
  );

  console.log("=== End Environment Variables ===\n");
  const { hasEditAccess, isLoading: isPermissionsLoading } = usePermissions();
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusFromUrl = searchParams
    .get("status")
    ?.toUpperCase() as Status | null;
  const validStatuses: Status[] = [
    "ALL",
    "DRAFT",
    "LIVE",
    "SCHEDULED",
    "PAUSED",
    "CONCLUDED",
    "TERMINATED",
  ];
  const initialStatus =
    statusFromUrl && validStatuses.includes(statusFromUrl)
      ? statusFromUrl
      : "ALL";

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<Status>(initialStatus);

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => setPageNumber(0), [searchTerm, status]);

  useEffect(() => {
    const urlStatus = searchParams
      .get("status")
      ?.toUpperCase() as Status | null;
    const expectedStatus =
      urlStatus && validStatuses.includes(urlStatus) ? urlStatus : "ALL";
    if (expectedStatus !== status) {
      setStatus(expectedStatus);
    }
  }, [searchParams]);

  useEffect(() => {
    const urlStatus = searchParams.get("status")?.toUpperCase();
    const expectedUrlStatus = status === "ALL" ? null : status.toLowerCase();
    const currentUrlStatus = urlStatus?.toLowerCase() || null;

    if (currentUrlStatus !== expectedUrlStatus) {
      const params = new URLSearchParams(searchParams.toString());
      if (status === "ALL") {
        params.delete("status");
      } else {
        params.set("status", status.toLowerCase());
      }
      const newUrl = params.toString()
        ? `/dashboard?${params.toString()}`
        : "/dashboard";
      router.replace(newUrl, { scroll: false });
    }
  }, [status, router, searchParams]);

  const {
    data: journeys,
    isLoading,
    isError,
    error,
    isFetching,
  } = useJourneysList(pageNumber, pageSize, searchTerm, status);

  const api = journeys?.data?.statusWiseCount;

  const mappedCounts: StatusCounts | undefined = useMemo(() => {
    if (!api) return undefined;
    const ALL =
      (api.draft ?? 0) +
      (api.live ?? 0) +
      (api.scheduled ?? 0) +
      (api.paused ?? 0) +
      (api.concluded ?? 0) +
      (api.terminated ?? 0);
    return {
      ALL,
      DRAFT: api.draft ?? 0,
      LIVE: api.live ?? 0,
      SCHEDULED: api.scheduled ?? 0,
      PAUSED: api.paused ?? 0,
      CONCLUDED: api.concluded ?? 0,
      TERMINATED: api.terminated ?? 0,
    };
  }, [api]);

  const lastCountsRef = useRef<StatusCounts | undefined>(undefined);
  const tabCounts = useMemo(() => {
    if (mappedCounts) lastCountsRef.current = mappedCounts;
    return mappedCounts ?? lastCountsRef.current;
  }, [mappedCounts]);

  const handlePreviousPage = useCallback(
    () => setPageNumber((prev) => Math.max(prev - 1, 0)),
    []
  );
  const handleNextPage = useCallback(
    () => setPageNumber((prev) => prev + 1),
    []
  );
  const handlePageChange = useCallback(
    (newPage: number) => setPageNumber(newPage),
    []
  );
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPageNumber(0);
  }, []);

  return (
    <Box sx={bodyContainerStyles}>
      <Box sx={bodyContentStyles}>
        <Box sx={bodyInnerStyles}>
          <Box sx={headerSectionStyles}>
            <Typography sx={titleStyles}>
              {PAGE_TITLES.JOURNEYS}
              {tabCounts?.ALL !== undefined && ` (${tabCounts.ALL})`}
            </Typography>

            <Box sx={headerActionsContainerStyles}>
              <Box sx={searchContainerWrapperStyles}>
                <SearchAndFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={createButtonStyles}
                onClick={() => {
                  const params = new URLSearchParams();
                  if (status !== "ALL") {
                    params.set("status", status.toLowerCase());
                  }
                  const queryString = params.toString();
                  router.push(
                    `/dashboard/create${queryString ? `?${queryString}` : ""}`
                  );
                }}
                disabled={!hasEditAccess || isPermissionsLoading}
              >
                {BUTTON_TEXT.CREATE_JOURNEY}
              </Button>
            </Box>
          </Box>

          <StatusTabs value={status} onChange={setStatus} counts={tabCounts} />

          <JourneysTable
            journeys={journeys}
            isLoading={isLoading}
            isError={isError}
            error={error as Error}
            isFetching={isFetching}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            handlePageChange={handlePageChange}
            pageNumber={pageNumber}
            handlePageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
            status={status}
          />
        </Box>
      </Box>
    </Box>
  );
}
