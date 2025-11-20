"use client";

import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  IconButton,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  tableContainerStyles,
  tableStyles,
  tableHeadStyles,
  tableRowStyles,
  tableCellStyles,
  statusChipStyles,
  actionButtonStyles,
  tableActionsContainerStyles,
  loadingContainerStyles,
  errorContainerStyles,
  paginationContainerStyles,
  previousPageButtonStyles,
  nextPageButtonStyles,
  pageNumbersContainerStyles,
  pageNumberButtonStyles,
  pageSizeFormControlStyles,
  pageSizeSelectStyles,
  tableHeaderCellStyles,
  tableHeaderContentStyles,
  tableHeaderCheckboxStyles,
  tableHeaderTextStyles,
  tableRowContentStyles,
  tableRowCheckboxStyles,
  actionMenuStyles,
  actionMenuItemStyles,
  actionMenuIconStyles,
  tableHeaderCellStylesRight,
  tableHeaderTextStylesRight,
  tableCellStylesRight,
  emptyStateContainerStyles,
  emptyStateTitleStyles,
  emptyStateSubtextStyles,
  emptyStateIllustrationStyles,
  tableLoadingOverlayStyles,
  journeyIconStyles,
} from "./styles/journeysTableStyles";
import {
  JOURNEY_TABLE_HEADERS,
  PAGE_SIZES,
  JOURNEY_MENU_ACTIONS,
} from "@/config/constants";
import { GetListOfCTAsResponse } from "@/api/services/types/journeys.interface";
import { THEME_COLORS } from "@/config/colors";
import { useState, useMemo, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { JOURNEY_ICONS } from "@/lib/mockData";

const getJourneyIcon = (journeyId: number): string => {
  const index = journeyId % JOURNEY_ICONS.length;
  return JOURNEY_ICONS[index];
};

const formatStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    DRAFT: "Draft",
    LIVE: "Live",
    SCHEDULED: "Scheduled",
    PAUSED: "Paused",
    CONCLUDED: "Concluded",
    TERMINATED: "Terminated",
  };
  return statusMap[status.toUpperCase()] || status;
};

const formatDate = (timestamp: number): string => {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Empty State Illustration Component
const EmptyStateIllustration = () => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const strokeColor =
    theme.palette.mode === "light"
      ? THEME_COLORS.TEXT.light.primary
      : THEME_COLORS.TEXT.dark.primary;

  return (
    <svg
      width="280"
      height="200"
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background blobs */}
      <ellipse
        cx="50"
        cy="80"
        rx="40"
        ry="30"
        fill={primaryColor}
        opacity="0.1"
      />
      <ellipse
        cx="230"
        cy="120"
        rx="35"
        ry="25"
        fill={primaryColor}
        opacity="0.08"
      />
      <ellipse
        cx="140"
        cy="180"
        rx="45"
        ry="35"
        fill={primaryColor}
        opacity="0.06"
      />

      {/* Paper airplane template - unfolded */}
      <g>
        {/* Main body */}
        <path
          d="M140 100 L140 140 L160 160 L140 180 L120 160 Z"
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
        />
        {/* Left wing */}
        <path
          d="M140 100 L80 120 L100 140 L140 120 Z"
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
        />
        {/* Right wing */}
        <path
          d="M140 100 L200 120 L180 140 L140 120 Z"
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
        />
        {/* Crease lines */}
        <line
          x1="140"
          y1="100"
          x2="140"
          y2="180"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <line
          x1="100"
          y1="140"
          x2="180"
          y2="140"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <line
          x1="120"
          y1="160"
          x2="160"
          y2="160"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
      </g>

      {/* Fountain pen */}
      <g>
        {/* Pen body */}
        <path
          d="M70 60 L90 50 L92 65 L90 80 L70 75 Z"
          fill={primaryColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Pen nib */}
        <path
          d="M70 75 L70 80 L75 78 L70 75 Z"
          fill={THEME_COLORS.GRAY["400"]}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Pen tip touching paper */}
        <circle cx="75" cy="78" r="2" fill={primaryColor} />
      </g>

      {/* Mouse cursor */}
      <g transform="translate(200, 150)">
        <path
          d="M0 0 L12 0 L8 12 L6 10 L0 0 Z"
          fill={primaryColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
      </g>

      {/* Plus icon in circle */}
      <g transform="translate(230, 160)">
        <circle
          cx="0"
          cy="0"
          r="18"
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="-8"
          y1="0"
          x2="8"
          y2="0"
          stroke={primaryColor}
          strokeWidth="2.5"
        />
        <line
          x1="0"
          y1="-8"
          x2="0"
          y2="8"
          stroke={primaryColor}
          strokeWidth="2.5"
        />
      </g>
    </svg>
  );
};

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
}) {
  const router = useRouter();
  const theme = useTheme();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [menuAnchor, setMenuAnchor] = useState<{
    element: HTMLElement;
    journeyId: number;
  } | null>(null);

  const totalPages = journeys?.data?.totalPages ?? 1;
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
    router.push(`/dashboard/edit/${journeyId}`);
  };

  const handleClone = (journeyId: number) => {
    router.push(`/dashboard/clone/${journeyId}`);
  };

  const handleCopyJourneyId = async (journeyId: number) => {
    try {
      await navigator.clipboard.writeText(journeyId.toString());
      // TODO: Show success toast/notification
    } catch (err) {
      console.error("Failed to copy journey ID:", err);
      // TODO: Show error toast/notification
    }
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <Box sx={loadingContainerStyles}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={errorContainerStyles}>
        <Typography color="error">
          Error: {error?.message || "Failed to load journeys."}
        </Typography>
      </Box>
    );
  }

  const hasNoJourneys =
    !isLoading &&
    !isFetching &&
    (!journeys?.data?.ctas || journeys.data.ctas.length === 0);

  if (hasNoJourneys) {
    return (
      <Box sx={emptyStateContainerStyles}>
        <Box sx={emptyStateIllustrationStyles}>
          <EmptyStateIllustration />
        </Box>
        <Typography sx={emptyStateTitleStyles}>
          All quiet on the journeys front.
        </Typography>
        <Typography sx={emptyStateSubtextStyles}>
          You don't have any journeys yet. Create a new journey to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxHeight: "660px",
        }}
      >
        {isFetching && (
          <Box sx={tableLoadingOverlayStyles}>
            <CircularProgress />
          </Box>
        )}
        <TableContainer sx={tableContainerStyles}>
          <Table sx={tableStyles} stickyHeader>
            <TableHead sx={tableHeadStyles}>
              <TableRow>
                {JOURNEY_TABLE_HEADERS.map((header, index) => {
                  const isActionsColumn = header === "Actions";
                  return (
                    <TableCell
                      key={header}
                      sx={
                        isActionsColumn
                          ? tableHeaderCellStylesRight
                          : tableHeaderCellStyles
                      }
                    >
                      {index === 0 ? (
                        <Box sx={tableHeaderContentStyles}>
                          <Checkbox
                            size="small"
                            sx={tableHeaderCheckboxStyles}
                            checked={allSelected}
                            indeterminate={someSelected && !allSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                          <Typography sx={tableHeaderTextStyles}>
                            {header.toUpperCase()}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography
                          sx={
                            isActionsColumn
                              ? tableHeaderTextStylesRight
                              : tableHeaderTextStyles
                          }
                        >
                          {header.toUpperCase()}
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {journeys?.data?.ctas.map((journey) => (
                <TableRow key={journey.id} sx={tableRowStyles}>
                  <TableCell sx={tableCellStyles}>
                    <Box sx={tableRowContentStyles}>
                      <Checkbox
                        size="small"
                        checked={selectedIds.has(journey.id)}
                        onChange={(e) =>
                          handleSelectItem(journey.id, e.target.checked)
                        }
                        sx={tableRowCheckboxStyles}
                      />
                      <Typography component="span" sx={journeyIconStyles}>
                        {getJourneyIcon(journey.id)}
                      </Typography>
                      {journey.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={formatStatusLabel(journey.ctaStatus)}
                      sx={statusChipStyles(theme)(journey.ctaStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={tableCellStyles}>
                    {journey.createdBy || "—"}
                  </TableCell>
                  <TableCell sx={tableCellStyles}>
                    {formatDate(journey.createdAt)}
                  </TableCell>
                  <TableCell sx={tableCellStylesRight}>
                    <Box sx={tableActionsContainerStyles}>
                      <Tooltip title="Edit journey" placement="top">
                        <IconButton
                          sx={actionButtonStyles}
                          size="small"
                          onClick={() => handleEdit(journey.id)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Clone journey" placement="top">
                        <IconButton
                          sx={actionButtonStyles}
                          size="small"
                          onClick={() => handleClone(journey.id)}
                        >
                          <ContentCopyOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More options" placement="top">
                        <IconButton
                          sx={actionButtonStyles}
                          size="small"
                          onClick={(e) => handleMenuOpen(e, journey.id)}
                        >
                          <MoreVertOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={paginationContainerStyles}>
        <IconButton
          onClick={handlePreviousPage}
          disabled={isFirstPage || isFetching}
          sx={previousPageButtonStyles(isFirstPage)}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Box sx={pageNumbersContainerStyles}>
          {[
            currentPage,
            ...(currentPage < totalPages ? [currentPage + 1] : []),
          ].map((page) => {
            const isActive = page === currentPage;
            return (
              <Box
                key={page}
                onClick={() => !isActive && handlePageChange(page - 1)}
                sx={pageNumberButtonStyles(isActive)}
              >
                {page}
              </Box>
            );
          })}
        </Box>

        <IconButton
          onClick={handleNextPage}
          disabled={isLastPage || isFetching}
          sx={nextPageButtonStyles(isLastPage)}
        >
          <ChevronRightIcon />
        </IconButton>

        <FormControl size="small" sx={pageSizeFormControlStyles}>
          <Select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            disabled={isFetching}
            IconComponent={KeyboardArrowDownIcon}
            sx={pageSizeSelectStyles}
          >
            {PAGE_SIZES.map((size) => (
              <MenuItem key={size} value={size}>
                {size} / page
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={actionMenuStyles}
      >
        {JOURNEY_MENU_ACTIONS.map((action) => {
          const getIconComponent = () => {
            if (!("icon" in action)) return null;
            switch (action.icon) {
              case "FileCopyOutlined":
                return FileCopyOutlinedIcon;
              case "PlayCircleOutline":
                return PlayCircleOutlineIcon;
              case "Schedule":
                return ScheduleIcon;
              case "PauseCircleOutline":
                return PauseCircleOutlineIcon;
              case "StopCircle":
                return StopCircleIcon;
              case "CheckCircleOutline":
                return CheckCircleOutlineIcon;
              default:
                return null;
            }
          };

          const IconComponent = getIconComponent();

          return (
            <MenuItem
              key={action.id}
              onClick={
                action.hasAction
                  ? () => handleCopyJourneyId(menuAnchor?.journeyId ?? 0)
                  : undefined
              }
              sx={actionMenuItemStyles}
            >
              {IconComponent && (
                <ListItemIcon sx={actionMenuIconStyles}>
                  <IconComponent fontSize="small" />
                </ListItemIcon>
              )}
              <ListItemText primary={action.label} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
