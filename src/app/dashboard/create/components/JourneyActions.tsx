"use client";

import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext, useWatch } from "react-hook-form";
import { journeyActionsStyles } from "./content/styles/journeyActionsStyles";
import { JOURNEY_TEXT } from "../constants/journeyConstants";
import { usePermissions } from "@/app/providers/PermissionProvider";
import { CreateJourneyFormData } from "../types/journey.interface";

interface JourneyActionsProps {
  activeTab: "setup" | "ui";
  onNext: () => void;
  isSubmitting?: boolean;
  isEditMode?: boolean;
  isCloneMode?: boolean;
  isTemplateValid?: boolean;
  hasTemplate?: boolean;
}

export default function JourneyActions({
  activeTab,
  onNext,
  isSubmitting = false,
  isEditMode = false,
  isCloneMode = false,
  isTemplateValid = false,
  hasTemplate = false,
}: JourneyActionsProps) {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasEditAccess } = usePermissions();
  const { control } = useFormContext<CreateJourneyFormData>();

  const enableImmediateStart = useWatch({
    control,
    name: "schedule.enableImmediateStart",
  });

  const enableScheduledStart = useWatch({
    control,
    name: "schedule.enableScheduledStart",
  });

  const getButtonText = (): string => {
    if (isSubmitting) {
      return isEditMode
        ? JOURNEY_TEXT.LOADING.UPDATING
        : JOURNEY_TEXT.LOADING.CREATING;
    }

    if (isEditMode) {
      if (enableImmediateStart) {
        return JOURNEY_TEXT.ACTIONS.UPDATE_PUBLISH_NOW;
      }
      if (enableScheduledStart) {
        return JOURNEY_TEXT.ACTIONS.UPDATE_SCHEDULED_FOR_PUBLISH;
      }
      return JOURNEY_TEXT.ACTIONS.UPDATE_DRAFT;
    }

    if (enableImmediateStart) {
      return JOURNEY_TEXT.ACTIONS.PUBLISH_NOW;
    }
    if (enableScheduledStart) {
      return JOURNEY_TEXT.ACTIONS.SCHEDULED_FOR_PUBLISH;
    }
    return JOURNEY_TEXT.ACTIONS.SAVE_AS_DRAFT;
  };

  const handleCancel = () => {
    const statusParam = searchParams?.get("status");
    if (statusParam) {
      router.push(`/dashboard?status=${statusParam}`);
    } else {
      router.back();
    }
  };

  return (
    <Box sx={journeyActionsStyles.actions}>
      <Button
        onClick={handleCancel}
        sx={journeyActionsStyles.cancelButton}
        size="large"
      >
        {JOURNEY_TEXT.ACTIONS.CANCEL}
      </Button>
      {activeTab === "ui" ? (
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onNext();
          }}
          variant="contained"
          sx={journeyActionsStyles.submitButton(theme)}
          size="large"
          disabled={!hasTemplate}
        >
          {JOURNEY_TEXT.ACTIONS.NEXT}
        </Button>
      ) : (
        <Button
          type="submit"
          variant="contained"
          sx={journeyActionsStyles.submitButton(theme)}
          size="large"
          disabled={isSubmitting || !isTemplateValid || !hasEditAccess}
        >
          {getButtonText()}
        </Button>
      )}
    </Box>
  );
}
