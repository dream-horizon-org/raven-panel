"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from "@mui/material";

interface JourneyBasicInfoProps {
  onNext: () => void;
}

export default function JourneyBasicInfo({ onNext }: JourneyBasicInfoProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save basic info to state/context
    onNext();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Journey Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Journey Name"
              placeholder="e.g., Welcome Onboarding Flow"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              helperText="Give your journey a clear, descriptive name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              placeholder="Describe what this journey does and when it should be triggered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              helperText="Help your team understand the purpose of this journey"
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!name.trim()}
          onClick={handleSubmit}
        >
          Next: Build Flow
        </Button>
      </Box>
    </Box>
  );
}

