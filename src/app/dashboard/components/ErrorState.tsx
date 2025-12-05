"use client";

import { Box, Typography } from "@mui/material";
import { errorContainerStyles } from "./styles/journeysTableStyles";
import { ERROR_MESSAGES } from "./DashboardConstants";

interface ErrorStateProps {
  error?: Error;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <Box sx={errorContainerStyles}>
      <Typography color="error">
        Error: {error?.message || ERROR_MESSAGES.loadFailed}
      </Typography>
    </Box>
  );
}
