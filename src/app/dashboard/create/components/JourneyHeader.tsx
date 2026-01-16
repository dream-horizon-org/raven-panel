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
import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, FieldValues, useFormContext, useWatch } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { journeyHeaderStyles } from "./content/styles/journeyHeaderStyles";
import { JOURNEY_ICONS } from "@/lib/mockData";
import { CreateJourneyFormData } from "../types/journey.interface";
import { JOURNEY_TEXT, DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS } from "../constants/journeyConstants";
import { hasValidTemplateContent } from "../utils/templateValidation.utils";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasTemplate: _hasTemplate = false, // Keep prop for backward compatibility but use hasValidTemplate instead
}: JourneyHeaderProps) {
  const router = useRouter();
  const [tutorialDialogOpen, setTutorialDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const { hasEditAccess } = usePermissions();
  const { getValues, setError, clearErrors, setValue } = useFormContext<CreateJourneyFormData>();
  const testJourneyMutation = useTestJourney();
  const testFeature = useWatch({ control, name: "testFeature" });
  
  // Watch actions to check template content
  const watchedActions = useWatch({ control, name: "nudgeSelection.actions" });
  
  // Check if templates have actual content (not just selected but configured)
  const hasValidTemplate = useMemo(() => {
    return hasValidTemplateContent(watchedActions);
  }, [watchedActions]);

  const handleBack = () => {
    const statusParam = searchParams?.get("status");
    if (statusParam) {
      router.push(`/dashboard?status=${statusParam}`);
    } else {
      router.back();
    }
  };

  const handleTestJourney = useCallback(async (
    userIds: string,
    expireInMins: number
  ) => {
    // Get current form data
    const formData = getValues();
    
    // Merge test journey values directly into formData without setting form state
    const formDataWithTestValues = {
      ...formData,
      testFeature: {
        ...formData.testFeature,
        userIds,
        expireInMins,
      },
    };
    
    await submitTestJourney({
      formData: formDataWithTestValues,
      setError,
      clearErrors,
      setValue,
      mutation: testJourneyMutation,
      onSuccess: () => {
        setIsTestDialogOpen(false);
      },
    });
  }, [getValues, setError, clearErrors, setValue, testJourneyMutation]);

  const handleCloseTestDialog = useCallback(() => {
    setIsTestDialogOpen(false);
  }, []);

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
              disabled={!hasValidTemplate || !hasEditAccess}
              sx={journeyHeaderStyles.actionButton}
            >
              {JOURNEY_TEXT.ACTIONS.TEST_JOURNEY}
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<SchoolIcon />}
            onClick={() => setTutorialDialogOpen(true)}
            sx={journeyHeaderStyles.actionButton}
          >
            {JOURNEY_TEXT.ACTIONS.LEARN_HOW_JOURNEYS_WORK}
          </Button>
        </Box>
      </Box>

      <JourneyTutorialDialog
        open={tutorialDialogOpen}
        onClose={() => setTutorialDialogOpen(false)}
      />

      <TestFeatureDialog
        open={isTestDialogOpen}
        onClose={handleCloseTestDialog}
        onSubmit={handleTestJourney}
        isLoading={testJourneyMutation.isPending}
        existingUserIds={testFeature?.userIds || ""}
        existingExpireInMins={testFeature?.expireInMins || DEFAULT_TEST_JOURNEY_EXPIRE_IN_MINS}
      />
    </>
  );
}
