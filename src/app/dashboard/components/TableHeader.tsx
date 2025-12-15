"use client";

import {
  TableHead,
  TableRow,
  TableCell,
  Box,
  Checkbox,
  Typography,
} from "@mui/material";
import {
  tableHeadStyles,
  tableHeaderCellStyles,
  tableHeaderCellStylesRight,
  tableHeaderContentStyles,
  tableHeaderCheckboxStyles,
  tableHeaderTextStyles,
  tableHeaderTextStylesRight,
} from "./styles/journeysTableStyles";
import { JOURNEY_TABLE_HEADERS } from "@/config/constants";
import { TABLE_CONFIG } from "./DashboardConstants";

interface TableHeaderProps {
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: (checked: boolean) => void;
}

export default function TableHeader({
  allSelected,
  someSelected,
  onSelectAll,
}: TableHeaderProps) {
  return (
    <TableHead sx={tableHeadStyles}>
      <TableRow>
        {JOURNEY_TABLE_HEADERS.map((header, index) => {
          const isActionsColumn = header === TABLE_CONFIG.actionsColumnHeader;
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
                    onChange={(e) => onSelectAll(e.target.checked)}
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
  );
}
