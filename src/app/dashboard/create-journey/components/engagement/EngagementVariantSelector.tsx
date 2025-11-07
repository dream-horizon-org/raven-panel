"use client";

import { Box, Typography, Card, CardContent, CardActionArea, Grid } from "@mui/material";
import { EngagementVariant } from "../../types";

interface EngagementVariantSelectorProps {
  engagementType: "tooltip" | "popup" | "bottomsheet";
  selectedVariant?: string;
  onSelectVariant: (variantId: string) => void;
}

// Mock variants based on engagement type
const getVariantsForType = (type: "tooltip" | "popup" | "bottomsheet"): EngagementVariant[] => {
  switch (type) {
    case "bottomsheet":
      return [
        {
          id: "bottomsheet-2-cta",
          name: "Bottomsheet with 2 CTA",
          description: "Bottom sheet with two call-to-action buttons",
        },
        {
          id: "bottomsheet-basic",
          name: "Basic Bottomsheet",
          description: "Simple bottom sheet with single CTA",
        },
      ];
    case "popup":
      return [
        {
          id: "popup-basic",
          name: "Basic Popup",
          description: "Simple popup dialog",
        },
        {
          id: "popup-with-image",
          name: "Popup with Image",
          description: "Popup with image header",
        },
      ];
    case "tooltip":
      return [
        {
          id: "tooltip-basic",
          name: "Basic Tooltip",
          description: "Simple tooltip",
        },
        {
          id: "tooltip-arrow",
          name: "Tooltip with Arrow",
          description: "Tooltip with pointing arrow",
        },
      ];
    default:
      return [];
  }
};

export default function EngagementVariantSelector({
  engagementType,
  selectedVariant,
  onSelectVariant,
}: EngagementVariantSelectorProps) {
  const variants = getVariantsForType(engagementType);

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
        Select Template
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: "block" }}>
        Choose a template variant for your {engagementType} engagement
      </Typography>

      <Grid container spacing={2}>
        {variants.map((variant) => (
          <Grid item xs={12} sm={6} key={variant.id}>
            <Card
              sx={{
                border: "2px solid",
                borderColor: selectedVariant === variant.id ? "primary.main" : "divider",
                cursor: "pointer",
                transition: "all 0.2s",
                bgcolor: selectedVariant === variant.id ? "action.selected" : "background.paper",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 3,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardActionArea onClick={() => onSelectVariant(variant.id)}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                    {variant.name}
                  </Typography>
                  {variant.description && (
                    <Typography variant="body2" color="text.secondary">
                      {variant.description}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

