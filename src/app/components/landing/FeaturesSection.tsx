"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { landingPageStyles } from "../styles/landingPageStyles";
import { FEATURES, LANDING_PAGE_TEXT } from "../constants";
import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  const theme = useTheme();

  return (
    <Box sx={landingPageStyles.rightSection(theme)}>
      <Box sx={landingPageStyles.featuresContainer}>
        <Typography
          variant="h3"
          component="h2"
          sx={landingPageStyles.featuresTitle(theme)}
        >
          {LANDING_PAGE_TEXT.featuresTitle}
        </Typography>
        <Box sx={landingPageStyles.featuresGrid}>
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

