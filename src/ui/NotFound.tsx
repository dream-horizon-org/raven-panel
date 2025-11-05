"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export function NotFound() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        p: 3,
      }}
    >
      <Typography variant="h1" sx={{ mb: 2 }}>
        404
      </Typography>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" onClick={() => router.push("/")}>
        Go Home
      </Button>
    </Box>
  );
}
