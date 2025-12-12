"use client";

import {
  Box,
  Table,
  TableBody,
  TableContainer,
  CircularProgress,
} from "@mui/material";
import { useState, useMemo, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GetListOfCTAsResponse } from "@/api/services/types/journeys.interface";
import { updateJourneyStatus } from "@/api/services/journeyStatus.service";
import { JourneyStatus } from "@/api/services/types/updateJourneyStatus.interface";
import { usePermissions } from "@/app/providers/PermissionProvider";
import {
  tableContainerStyles,
  tableStyles,
  tableLoadingOverlayStyles,
} from "./styles/journeysTableStyles";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import TableHeader from "./TableHeader";
import JourneyTableRow from "./JourneyTableRow";
import Pagination from "./Pagination";
import ActionMenu from "./ActionMenu";
import {
  ROUTE_PATHS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  JOURNEY_STATUS_LABELS,
  DEFAULT_VALUES,
  TABLE_CONFIG,
} from "./DashboardConstants";
import { Status } from "./StatusTab";

export default function JourneysTable({
  journeys,
  isLoading,
  isError,
  error,
  isFetching,
  handlePreviousPage,
  handleNextPage,
  handlePageChange,
  pageNumber,
  handlePageSizeChange,
  pageSize,
  status,
}: {
  journeys: GetListOfCTAsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error;
  isFetching: boolean;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handlePageChange: (page: number) => void;
  pageNumber: number;
  handlePageSizeChange: (size: number) => void;
  pageSize: number;
  status: Status;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasEditAccess, hasPublishAccess } = usePermissions();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [menuAnchor, setMenuAnchor] = useState<{
    element: HTMLElement;
    journeyId: number;
  } | null>(null);

  const totalPages =
    journeys?.data?.totalPages ?? DEFAULT_VALUES.defaultTotalPages;
  const currentPage = pageNumber + 1;
  const isFirstPage = pageNumber === 0;
  const isLastPage = currentPage >= totalPages;

  const journeyIds = useMemo(
    () => new Set(journeys?.data?.ctas.map((j) => j.id) || []),
    [journeys?.data?.ctas]
  );

  const allSelected = useMemo(
    () =>
      journeyIds.size > 0 &&
      Array.from(journeyIds).every((id) => selectedIds.has(id)),
    [journeyIds, selectedIds]
  );

  const someSelected = useMemo(
    () =>
      selectedIds.size > 0 &&
      Array.from(journeyIds).some((id) => selectedIds.has(id)),
    [journeyIds, selectedIds]
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(journeyIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleMenuOpen = (
    event: MouseEvent<HTMLElement>,
    journeyId: number
  ) => {
    setMenuAnchor({ element: event.currentTarget, journeyId });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = (journeyId: number) => {
    const params = new URLSearchParams();
    if (status !== "ALL") {
      params.set("status", status.toLowerCase());
    }
    const queryString = params.toString();
    router.push(`${ROUTE_PATHS.edit(journeyId)}${queryString ? `?${queryString}` : ""}`);
  };

  const handleClone = (journeyId: number) => {
    const params = new URLSearchParams();
    if (status !== "ALL") {
      params.set("status", status.toLowerCase());
    }
    const queryString = params.toString();
    router.push(`${ROUTE_PATHS.clone(journeyId)}${queryString ? `?${queryString}` : ""}`);
  };

  const handleCopyJourneyId = async (journeyId: number) => {
    try {
      await navigator.clipboard.writeText(journeyId.toString());
      toast.success(SUCCESS_MESSAGES.idCopied);
    } catch (err) {
      console.error("Failed to copy journey ID:", err);
      toast.error(ERROR_MESSAGES.copyFailed);
    }
    handleMenuClose();
  };

  const handleStatusChange = async (
    journeyId: number,
    status: JourneyStatus
  ) => {
    try {
      await updateJourneyStatus(journeyId, status);
      toast.success(
        SUCCESS_MESSAGES.statusUpdated(JOURNEY_STATUS_LABELS[status])
      );
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
    } catch (error) {
      console.error(`Error updating journey status to ${status}:`, error);
      toast.error(ERROR_MESSAGES.updateFailed);
    }
    handleMenuClose();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} />;
  }

  const hasNoJourneys =
    !isLoading &&
    !isFetching &&
    (!journeys?.data?.ctas || journeys.data.ctas.length === 0);

  if (hasNoJourneys) {
    return <EmptyState />;
  }

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxHeight: TABLE_CONFIG.maxHeight,
        }}
      >
        {isFetching && (
          <Box sx={tableLoadingOverlayStyles}>
            <CircularProgress />
          </Box>
        )}
        <TableContainer sx={tableContainerStyles}>
          <Table sx={tableStyles} stickyHeader>
            <TableHeader
              allSelected={allSelected}
              someSelected={someSelected}
              onSelectAll={handleSelectAll}
            />
            <TableBody>
              {journeys?.data?.ctas.map((journey) => (
                <JourneyTableRow
                  key={journey.id}
                  journey={journey}
                  isSelected={selectedIds.has(journey.id)}
                  hasEditAccess={hasEditAccess}
                  onSelect={handleSelectItem}
                  onEdit={handleEdit}
                  onClone={handleClone}
                  onMenuOpen={handleMenuOpen}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        isFetching={isFetching}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <ActionMenu
        anchorEl={menuAnchor?.element || null}
        journeyId={menuAnchor?.journeyId || 0}
        hasEditAccess={hasEditAccess}
        hasPublishAccess={hasPublishAccess}
        onClose={handleMenuClose}
        onCopyJourneyId={handleCopyJourneyId}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
