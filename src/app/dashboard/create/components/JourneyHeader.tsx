"use client";

import { Box, TextField, Typography, IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRouter } from "next/navigation";
import { Controller, FieldValues } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { journeyHeaderStyles } from "./content/styles/journeyHeaderStyles";
import { JOURNEY_ICONS } from "@/lib/mockData";
import { CreateJourneyFormData } from "../types/journey.interface";
import { JOURNEY_TEXT } from "../constants/journeyConstants";

interface JourneyHeaderProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  isEditMode?: boolean;
}

export default function JourneyHeader({
  control,
  errors,
  isEditMode = false,
}: JourneyHeaderProps) {
  const router = useRouter();

  return (
    <Box sx={journeyHeaderStyles.header}>
      <IconButton
        onClick={() => router.back()}
        sx={journeyHeaderStyles.backButton}
        size="small"
      >
        <ArrowBackIcon />
      </IconButton>
      <Box sx={journeyHeaderStyles.headerTitle}>
        <Typography component="span" sx={journeyHeaderStyles.headerIcon}>
          {JOURNEY_ICONS[0]}
        </Typography>
        <Controller
          name="ctaMetadata.ctaTitle"
          control={control}
          rules={{ required: JOURNEY_TEXT.VALIDATION.NAME_REQUIRED }}
          render={({ field }: { field: FieldValues }) => (
            <TextField
              {...field}
              placeholder={JOURNEY_TEXT.HEADER.PLACEHOLDER}
              variant="outlined"
              error={!!errors.ctaMetadata?.ctaTitle}
              disabled={isEditMode}
              sx={journeyHeaderStyles.headerNameField}
            />
          )}
        />
        <Tooltip title={JOURNEY_TEXT.HEADER.TOOLTIP} placement="top">
          <InfoOutlinedIcon sx={journeyHeaderStyles.infoIcon} />
        </Tooltip>
      </Box>
    </Box>
  );
}
