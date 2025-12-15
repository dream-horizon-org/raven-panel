"use client";

import { Box, Typography } from "@mui/material";
import {
  emptyStateContainerStyles,
  emptyStateTitleStyles,
  emptyStateSubtextStyles,
  emptyStateIllustrationStyles,
} from "./styles/journeysTableStyles";
import { EMPTY_STATE_TEXT } from "./DashboardConstants";
import EmptyStateIllustration from "./EmptyStateIllustration";

export default function EmptyState() {
  return (
    <Box sx={emptyStateContainerStyles}>
      <Box sx={emptyStateIllustrationStyles}>
        <EmptyStateIllustration />
      </Box>
      <Typography sx={emptyStateTitleStyles}>
        {EMPTY_STATE_TEXT.title}
      </Typography>
      <Typography sx={emptyStateSubtextStyles}>
        {EMPTY_STATE_TEXT.subtext}
      </Typography>
    </Box>
  );
}
