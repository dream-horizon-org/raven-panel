"use client";

import { Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter, useSearchParams } from "next/navigation";
import { journeyActionsStyles } from "./content/styles/journeyActionsStyles";
import { JOURNEY_TEXT } from "../constants/journeyConstants";
import { usePermissions } from "@/app/providers/PermissionProvider";

interface JourneyActionsProps {
  activeTab: "setup" | "ui";
  onNext: () => void;
  isSubmitting?: boolean;
  isEditMode?: boolean;
  isTemplateValid?: boolean;
  hasTemplate?: boolean;
}

export default function JourneyActions({
  activeTab,
  onNext,
  isSubmitting = false,
  isEditMode = false,
  isTemplateValid = false,
  hasTemplate = false,
}: JourneyActionsProps) {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    hasEditAccess,
    isLoading,
    userEmail,
    hasViewAccess,
    hasPublishAccess,
  } = usePermissions();

  // Debug logging for all users
  const createButtonDisabled =
    isSubmitting || !isTemplateValid || !hasEditAccess;
  console.log("[JourneyActions] 🔘 Create/Update Button State:", {
    userEmail,
    hasViewAccess,
    hasEditAccess,
    hasPublishAccess,
    isLoading,
    isSubmitting,
    isTemplateValid,
    activeTab,
    isEditMode,
    buttonDisabled: createButtonDisabled,
    disabledReason: {
      isSubmitting,
      isTemplateInvalid: !isTemplateValid,
      noEditAccess: !hasEditAccess,
    },
  });

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
          {isSubmitting
            ? isEditMode
              ? JOURNEY_TEXT.LOADING.UPDATING
              : JOURNEY_TEXT.LOADING.CREATING
            : isEditMode
            ? JOURNEY_TEXT.LOADING.UPDATE_JOURNEY
            : JOURNEY_TEXT.ACTIONS.CREATE_JOURNEY}
        </Button>
      )}
    </Box>
  );
}
