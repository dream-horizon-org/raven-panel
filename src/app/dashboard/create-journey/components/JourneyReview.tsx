"use client";

import { Box, Button, Typography, Paper } from "@mui/material";

interface JourneyReviewProps {
  onBack: () => void;
}

export default function JourneyReview({ onBack }: JourneyReviewProps) {
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Review & Publish
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review your journey configuration and publish when ready.
        </Typography>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" color="success">
          Publish Journey
        </Button>
      </Box>
    </Box>
  );
}

