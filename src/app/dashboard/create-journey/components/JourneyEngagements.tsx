"use client";

import { Box, Button, Typography, Paper } from "@mui/material";

interface JourneyEngagementsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function JourneyEngagements({
  onNext,
  onBack,
}: JourneyEngagementsProps) {
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Configure Engagements
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Engagements are configured per state in the flow builder. Go back to
          the flow builder and click on any state node to configure its
          engagements.
        </Typography>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onNext}>
          Next: Review & Publish
        </Button>
      </Box>
    </Box>
  );
}

