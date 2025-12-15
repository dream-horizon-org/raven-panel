"use client";

import { Box, IconButton, FormControl, Select, MenuItem } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  paginationContainerStyles,
  previousPageButtonStyles,
  nextPageButtonStyles,
  pageNumbersContainerStyles,
  pageNumberButtonStyles,
  pageSizeFormControlStyles,
  pageSizeSelectStyles,
} from "./styles/journeysTableStyles";
import { PAGE_SIZES } from "@/config/constants";
import { PAGINATION_TEXT } from "./DashboardConstants";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  isFetching: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  isFirstPage,
  isLastPage,
  isFetching,
  onPreviousPage,
  onNextPage,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <Box sx={paginationContainerStyles}>
      <IconButton
        onClick={onPreviousPage}
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
              onClick={() => !isActive && onPageChange(page - 1)}
              sx={pageNumberButtonStyles(isActive)}
            >
              {page}
            </Box>
          );
        })}
      </Box>

      <IconButton
        onClick={onNextPage}
        disabled={isLastPage || isFetching}
        sx={nextPageButtonStyles(isLastPage)}
      >
        <ChevronRightIcon />
      </IconButton>

      <FormControl size="small" sx={pageSizeFormControlStyles}>
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={isFetching}
          IconComponent={KeyboardArrowDownIcon}
          sx={pageSizeSelectStyles}
        >
          {PAGE_SIZES.map((size) => (
            <MenuItem key={size} value={size}>
              {PAGINATION_TEXT.perPage(size)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
