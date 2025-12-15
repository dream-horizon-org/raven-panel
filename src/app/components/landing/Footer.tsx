"use client";

import { Box, Container, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FOOTER_TEXT } from "@/config/constants";
import { landingPageStyles } from "../styles/landingPageStyles";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box component="footer" sx={landingPageStyles.footer(theme)}>
      <Container maxWidth="xl">
        <Box sx={landingPageStyles.footerContent}>
          <Typography variant="body2" sx={landingPageStyles.footerText(theme)}>
            {FOOTER_TEXT}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
