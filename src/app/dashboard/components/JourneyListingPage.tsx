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
import { useMemo, useRef, useState, useEffect } from "react";
import { useJourneysList } from "@/hooks/useJourneysList";
import { useRouter } from "next/navigation";

export default function JourneyListingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<Status>("ALL");

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => setPageNumber(0), [searchTerm, status]);

  const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV;

  console.log(
    "env::: inside JourneyListingPage ",
    env,
    process.env.NEXT_PUBLIC_PRODUCTION_URL,
    process.env.NEXT_PUBLIC_UAT_URL,
    process.env.NEXT_PUBLIC_ENV,
    process.env.NODE_ENV
  );
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

  const handlePreviousPage = () =>
    setPageNumber((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () => setPageNumber((prev) => prev + 1);
  const handlePageChange = (newPage: number) => setPageNumber(newPage);
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageNumber(0);
  };

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
                onClick={() => router.push("/dashboard/create")}
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
          />
        </Box>
      </Box>
    </Box>
  );
}
