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
  const { hasEditAccess, isLoading: isPermissionsLoading, userEmail, hasViewAccess, hasPublishAccess } = usePermissions();
  
  // Debug logging for all users
  const createButtonDisabled = !hasEditAccess || isPermissionsLoading;
  console.log("[JourneyListingPage] 🔘 Create Button State:", {
    userEmail,
    hasViewAccess,
    hasEditAccess,
    hasPublishAccess,
    isPermissionsLoading,
    createButtonDisabled,
    disabledReason: {
      noEditAccess: !hasEditAccess,
      isLoading: isPermissionsLoading,
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const statusFromUrl = searchParams.get("status")?.toUpperCase() as Status | null;
  const validStatuses: Status[] = ["ALL", "DRAFT", "LIVE", "SCHEDULED", "PAUSED", "CONCLUDED", "TERMINATED"];
  const initialStatus = statusFromUrl && validStatuses.includes(statusFromUrl) ? statusFromUrl : "ALL";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<Status>(initialStatus);

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => setPageNumber(0), [searchTerm, status]);


  useEffect(() => {
    const urlStatus = searchParams.get("status")?.toUpperCase() as Status | null;
    const expectedStatus = urlStatus && validStatuses.includes(urlStatus) ? urlStatus : "ALL";
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
                  router.push(`/dashboard/create${queryString ? `?${queryString}` : ""}`);
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
