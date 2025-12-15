"use client";

import { Box, CircularProgress } from "@mui/material";
import { loadingContainerStyles } from "./styles/journeysTableStyles";

export default function LoadingState() {
  return (
    <Box sx={loadingContainerStyles}>
      <CircularProgress />
    </Box>
  );
}
