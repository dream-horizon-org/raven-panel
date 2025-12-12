"use client";

import {
  Box,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SchoolIcon from "@mui/icons-material/School";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, FieldValues } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { journeyHeaderStyles } from "./content/styles/journeyHeaderStyles";
import { JOURNEY_ICONS } from "@/lib/mockData";
import { CreateJourneyFormData } from "../types/journey.interface";
import { JOURNEY_TEXT } from "../constants/journeyConstants";
import JourneyTutorialDialog from "./content/JourneyTutorialDialog";

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
  const [tutorialDialogOpen, setTutorialDialogOpen] = useState(false);

  const searchParams = useSearchParams();

  const handleBack = () => {
    const statusParam = searchParams?.get("status");
    if (statusParam) {
      router.push(`/dashboard?status=${statusParam}`);
    } else {
      router.back();
    }
  };

  return (
    <>
      <Box sx={journeyHeaderStyles.header}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={handleBack}
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
            <Tooltip title={JOURNEY_TEXT.HEADER.TOOLTIP} placement="top" arrow>
              <InfoOutlinedIcon sx={journeyHeaderStyles.infoIcon} />
            </Tooltip>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<SchoolIcon />}
          onClick={() => setTutorialDialogOpen(true)}
          sx={{
            bgcolor: "rgba(99, 102, 241, 0.25)",
            borderColor: "rgba(99, 102, 241, 0.4)",
            color: "primary.main",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              bgcolor: "rgba(99, 102, 241, 0.3)",
              borderColor: "primary.main",
            },
          }}
        >
          Learn How Journeys Work
        </Button>
      </Box>

      <JourneyTutorialDialog
        open={tutorialDialogOpen}
        onClose={() => setTutorialDialogOpen(false)}
      />
    </>
  );
}
