"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import {
  actionButtonStyles,
  tableActionsContainerStyles,
} from "./styles/journeysTableStyles";
import { TOOLTIP_LABELS } from "./DashboardConstants";
import { MouseEvent } from "react";

interface TableActionsProps {
  journeyId: number;
  hasEditAccess: boolean;
  onEdit: (journeyId: number) => void;
  onClone: (journeyId: number) => void;
  onMenuOpen: (event: MouseEvent<HTMLElement>, journeyId: number) => void;
}

export default function TableActions({
  journeyId,
  hasEditAccess,
  onEdit,
  onClone,
  onMenuOpen,
}: TableActionsProps) {
  return (
    <Box sx={tableActionsContainerStyles}>
      <Tooltip title={TOOLTIP_LABELS.editJourney} placement="top">
        <span>
          <IconButton
            sx={actionButtonStyles}
            size="small"
            onClick={() => onEdit(journeyId)}
            disabled={!hasEditAccess}
          >
            <EditOutlinedIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={TOOLTIP_LABELS.cloneJourney} placement="top">
        <span>
          <IconButton
            sx={actionButtonStyles}
            size="small"
            onClick={() => onClone(journeyId)}
            disabled={!hasEditAccess}
          >
            <ContentCopyOutlinedIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={TOOLTIP_LABELS.moreOptions} placement="top">
        <IconButton
          sx={actionButtonStyles}
          size="small"
          onClick={(e) => onMenuOpen(e, journeyId)}
        >
          <MoreVertOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
