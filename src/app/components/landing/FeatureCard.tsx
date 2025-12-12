"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { landingPageStyles } from "../styles/landingPageStyles";
import { GRID_AREAS, ANIMATION_DELAY_MULTIPLIER } from "../constants";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ sx?: SxProps<Theme> }>;
  color: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  const theme = useTheme();
  const IconComponent = feature.icon;

  // Custom placement: 0=left, 1=center-top, 2=center-bottom, 3=right
  const gridArea = GRID_AREAS[Math.min(index, GRID_AREAS.length - 1)];

  // Staggered animation delay for floating effect
  const animationDelay = `${index * ANIMATION_DELAY_MULTIPLIER}s`;

  return (
    <Card
      sx={landingPageStyles.featureCard(
        theme,
        gridArea,
        feature.color,
        animationDelay
      )}
    >
      <Box sx={landingPageStyles.featureColorBar(feature.color)} />
      <CardContent sx={landingPageStyles.featureCardContent}>
        <Box sx={landingPageStyles.featureHeader}>
          <Box
            sx={landingPageStyles.featureIconWrapper(
              theme,
              index,
              feature.color
            )}
          >
            <IconComponent
              sx={landingPageStyles.featureIcon(theme, index, feature.color)}
            />
          </Box>
          <Typography
            variant="h6"
            component="h3"
            sx={landingPageStyles.featureTitle(theme)}
          >
            {feature.title}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={landingPageStyles.featureDescription(theme)}
        >
          {feature.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
