"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { APP_NAME } from "@/config/constants";
import { landingPageStyles } from "../styles/landingPageStyles";

export default function Logo() {
  const theme = useTheme();

  return (
    <Box sx={landingPageStyles.logoContainer(theme)}>
      <Box component="span" sx={landingPageStyles.logoIcon(theme)}>
        {APP_NAME.charAt(0)}
      </Box>
      <Typography variant="h5" sx={landingPageStyles.logoText(theme)}>
        {APP_NAME}
      </Typography>
    </Box>
  );
}
