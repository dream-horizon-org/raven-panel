"use client";

import {
  TableRow,
  TableCell,
  Box,
  Checkbox,
  Typography,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  tableRowStyles,
  tableCellStyles,
  tableCellStylesRight,
  tableRowContentStyles,
  tableRowCheckboxStyles,
  statusChipStyles,
  journeyIconStyles,
} from "./styles/journeysTableStyles";
import { GetListOfCTAsResponse } from "@/api/services/types/journeys.interface";
import { formatStatusLabel, formatDate, getJourneyIcon } from "./Dashboard.utils";
import { DEFAULT_VALUES } from "./DashboardConstants";
import TableActions from "./TableActions";

type Journey = GetListOfCTAsResponse["data"]["ctas"][0];

interface JourneyTableRowProps {
  journey: Journey;
  isSelected: boolean;
  hasEditAccess: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onEdit: (journeyId: number) => void;
  onClone: (journeyId: number) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, journeyId: number) => void;
}

export default function JourneyTableRow({
  journey,
  isSelected,
  hasEditAccess,
  onSelect,
  onEdit,
  onClone,
  onMenuOpen,
}: JourneyTableRowProps) {
  const theme = useTheme();

  return (
    <TableRow sx={tableRowStyles}>
      <TableCell sx={tableCellStyles}>
        <Box sx={tableRowContentStyles}>
          <Checkbox
            size="small"
            checked={isSelected}
            onChange={(e) => onSelect(journey.id, e.target.checked)}
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
        {journey.createdBy || DEFAULT_VALUES.emptyCreator}
      </TableCell>
      <TableCell sx={tableCellStyles}>
        {formatDate(journey.createdAt)}
      </TableCell>
      <TableCell sx={tableCellStylesRight}>
        <TableActions
          journeyId={journey.id}
          hasEditAccess={hasEditAccess}
          onEdit={onEdit}
          onClone={onClone}
          onMenuOpen={onMenuOpen}
        />
      </TableCell>
    </TableRow>
  );
}
