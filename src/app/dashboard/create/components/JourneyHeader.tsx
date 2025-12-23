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
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { journeyHeaderStyles } from "./content/styles/journeyHeaderStyles";
import { JOURNEY_ICONS } from "@/lib/mockData";
import { CreateJourneyFormData } from "../types/journey.interface";
import { JOURNEY_TEXT } from "../constants/journeyConstants";
import JourneyTutorialDialog from "./content/JourneyTutorialDialog";
import TestFeatureDialog from "./TestFeatureDialog";
import { submitTestJourney } from "../utils/testJourneySubmission.utils";
import { useTestJourney } from "../hooks/useTestJourney";
import { usePermissions } from "@/app/providers/PermissionProvider";

interface JourneyHeaderProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  isEditMode?: boolean;
  hasTemplate?: boolean;
}

export default function JourneyHeader({
  control,
  errors,
  isEditMode = false,
  hasTemplate = false,
}: JourneyHeaderProps) {
  const router = useRouter();
  const [tutorialDialogOpen, setTutorialDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const { hasEditAccess } = usePermissions();
  const { getValues, setError, clearErrors, setValue, watch } = useFormContext<CreateJourneyFormData>();
  const testJourneyMutation = useTestJourney();
  const testFeature = watch("testFeature");

  const handleBack = () => {
    const statusParam = searchParams?.get("status");
    if (statusParam) {
      router.push(`/dashboard?status=${statusParam}`);
    } else {
      router.back();
    }
  };

  const handleTestJourney = async (
    userIds: string,
    expireInMins: number
  ) => {
    // Store values in formData first
    setValue("testFeature.userIds", userIds);
    setValue("testFeature.expireInMins", expireInMins);
    
    // Now get formData which includes the stored values
    const formData = getValues();
    await submitTestJourney({
      formData,
      setError,
      clearErrors,
      setValue,
      mutation: testJourneyMutation,
      onSuccess: () => {
        setIsTestDialogOpen(false);
      },
    });
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
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {!isEditMode && (
            <Button
              variant="outlined"
              onClick={() => setIsTestDialogOpen(true)}
              disabled={!hasTemplate || !hasEditAccess}
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
              Test Journey
            </Button>
          )}
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
      </Box>

      <JourneyTutorialDialog
        open={tutorialDialogOpen}
        onClose={() => setTutorialDialogOpen(false)}
      />

      <TestFeatureDialog
        open={isTestDialogOpen}
        onClose={() => setIsTestDialogOpen(false)}
        onSubmit={handleTestJourney}
        isLoading={testJourneyMutation.isPending}
        existingUserIds={testFeature?.userIds || ""}
        existingExpireInMins={testFeature?.expireInMins || 30}
      />
    </>
  );
}
