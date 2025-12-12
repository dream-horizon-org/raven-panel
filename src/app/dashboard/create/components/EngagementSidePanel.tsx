"use client";

import { Drawer, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
  Control,
  FieldErrors,
  useWatch,
  useFormContext,
  Path,
  get,
} from "react-hook-form";
import {
  CreateJourneyFormData,
  NudgeType,
  ReactNativeJson,
} from "../types/journey.interface";
import { useState, useEffect, useRef, useMemo } from "react";
import { engagementSidePanelStyles } from "./content/styles/engagementSidePanelStyles";
import { validateTemplate } from "../utils/validation.utils.";
import { JOURNEY_TEXT } from "../constants/journeyConstants";
import { UnSavePopup } from "./UnSavePopup";
import { EngagementLocators } from "./EngagementLocators";
import { getInitialTemplate } from "../utils/engagement.utils";

interface EngagementSidePanelProps {
  open: boolean;
  onClose: () => void;
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  onTemplateSaved?: () => void;
  engagementId?: string | null;
}

export default function EngagementSidePanel({
  open,
  onClose,
  control,
  errors,
  onTemplateSaved,
  engagementId,
}: EngagementSidePanelProps) {
  const {
    getValues,
    setValue,
    setError,
    clearErrors,
    formState,
  } = useFormContext<CreateJourneyFormData>();
  const [activeSubTab, setActiveSubTab] = useState<
    "template" | "content" | "location"
  >("template");
  const [pendingCloseAction, setPendingCloseAction] = useState<
    (() => void) | null
  >(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const initialTemplateRef = useRef<ReactNativeJson | null>(null);

  const errorSource = formState.errors as FieldErrors<CreateJourneyFormData>;

  const actions = useWatch({
    control,
    name: "nudgeSelection.actions",
  });

  const actionIndex = useMemo(() => {
    if (!engagementId) return 0;

    const formActions = getValues("nudgeSelection.actions") || [];
    const index = formActions.findIndex((action) => {
      const actionIdPrefix = action.actionId.includes("_")
        ? action.actionId.split("_")[0]
        : action.actionId;
      return actionIdPrefix === engagementId;
    });

    return index >= 0 ? index : 0;
  }, [engagementId, getValues]);

  const engagementType = useMemo(() => {
    const formActions = getValues("nudgeSelection.actions") || [];
    const targetAction = formActions[actionIndex];
    return targetAction?.type || actions?.[actionIndex]?.type;
  }, [actions, getValues, engagementId, actionIndex]);

  const isTooltip = engagementType === NudgeType.TOOLTIP;

  useEffect(() => {
    if (open) {
      setActiveSubTab("template");
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const currentData = getValues();
      const currentActions = currentData.nudgeSelection?.actions || [];

      initialTemplateRef.current = getInitialTemplate(
        currentActions,
        engagementId
      );
    }
  }, [open, getValues, engagementId]);

  const hasErrorsInPath = (path: string): boolean => {
    const value = get(errorSource, path);
    if (!value) return false;

    if (typeof value === "object" && "message" in value) return true;
    if (typeof value === "object") {
      return Object.keys(value as Record<string, unknown>).some((key) =>
        hasErrorsInPath(`${path}.${key}`)
      );
    }

    return false;
  };

  const hasContentErrors = (): boolean => {
    if (isTooltip) {
      const props = get(
        errorSource,
        `nudgeSelection.actions.${actionIndex}.template.props`
      ) as Record<string, unknown> | undefined;

      if (props && typeof props === "object") {
        const keysWithError = Object.keys(props).filter(
          (k) =>
            k !== "targetScreen" &&
            k !== "targetId" &&
            (props as Record<string, unknown>)[k]
        );
        if (keysWithError.length > 0) return true;
      }

      return hasErrorsInPath(
        `nudgeSelection.actions.${actionIndex}.template.styles`
      );
    }

    return hasErrorsInPath(
      `nudgeSelection.actions.${actionIndex}.template.children`
    );
  };

  const hasLocationErrors = (): boolean => {
    if (!isTooltip) return false;

    return (
      !!get(
        errorSource,
        `nudgeSelection.actions.${actionIndex}.template.props.targetScreen`
      ) ||
      !!get(
        errorSource,
        `nudgeSelection.actions.${actionIndex}.template.props.targetId`
      )
    );
  };

  const handleSave = () => {
    const data = getValues();
    if (!data.nudgeSelection?.actions?.[actionIndex]?.template) {
      onClose();
      return;
    }

    const template = data.nudgeSelection.actions[actionIndex].template;
    const basePath = `nudgeSelection.actions.${actionIndex}.template` as Path<
      CreateJourneyFormData
    >;

    const isValid = validateTemplate(template, basePath, setError, clearErrors);

    if (isValid) {
      if (onTemplateSaved) {
        onTemplateSaved();
      }
      initialTemplateRef.current = JSON.parse(JSON.stringify(template));
      onClose();
    } else {
      setTimeout(() => {
        const locationHasErrors = hasLocationErrors();
        const contentHasErrors = hasContentErrors();

        if (locationHasErrors) {
          setActiveSubTab("location");
        } else if (contentHasErrors) {
          setActiveSubTab("content");
        }
      }, 100);
    }
  };

  const handleCloseRequest = (closeAction: () => void) => {
    const currentData = getValues();
    const currentTemplate = currentData.nudgeSelection?.actions?.[0]?.template;
    const initialTemplate = initialTemplateRef.current;

    const hasChanges =
      JSON.stringify(currentTemplate) !== JSON.stringify(initialTemplate);

    if (hasChanges) {
      setPendingCloseAction(closeAction);
      setShowConfirmDialog(true);
    } else {
      closeAction();
    }
  };

  const handleConfirmSave = () => {
    setShowConfirmDialog(false);
    const closeAction = pendingCloseAction;
    setPendingCloseAction(null);
    handleSave();
    if (closeAction) {
      closeAction();
    }
  };
  const handleDialogCancel = () => {
    setShowConfirmDialog(false);
    setPendingCloseAction(null);
  };

  const handleContinueEditing = () => {
    setShowConfirmDialog(false);
    setPendingCloseAction(null);
  };

  const handleDiscard = () => {
    if (initialTemplateRef.current) {
      setValue(
        `nudgeSelection.actions.${actionIndex}.template` as any,
        initialTemplateRef.current
      );
    } else {
      setValue(
        `nudgeSelection.actions.${actionIndex}.template` as any,
        (undefined as unknown) as ReactNativeJson
      );
    }
    setShowConfirmDialog(false);
    setPendingCloseAction(null);
    if (pendingCloseAction) {
      pendingCloseAction();
    } else {
      onClose();
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => handleCloseRequest(onClose)}
        PaperProps={{
          sx: engagementSidePanelStyles.drawerPaper,
        }}
      >
        <Box sx={engagementSidePanelStyles.container}>
          <Box sx={engagementSidePanelStyles.header}>
            <Typography sx={engagementSidePanelStyles.title}>
              {engagementType === NudgeType.NUDGE_UI
                ? JOURNEY_TEXT.ENGAGEMENT.BOTTOMSHEET
                : `${JOURNEY_TEXT.ENGAGEMENT.CONFIGURE_ENGAGEMENT} ${
                    engagementType ? String(engagementType) : "Select Type"
                  }`}
            </Typography>
            <IconButton
              onClick={() => handleCloseRequest(onClose)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <EngagementLocators
            control={control}
            engagementId={engagementId}
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
            hasContentErrors={hasContentErrors}
            hasLocationErrors={hasLocationErrors}
            isTooltip={isTooltip}
            errors={errors}
            handleCloseRequest={handleCloseRequest}
            handleSave={handleSave}
            onClose={onClose}
          />
        </Box>
      </Drawer>

      <UnSavePopup
        showConfirmDialog={showConfirmDialog}
        handleDialogCancel={handleDialogCancel}
        handleConfirmDiscard={handleDiscard}
        handleContinueEditing={handleContinueEditing}
        handleConfirmSave={handleConfirmSave}
      />
    </>
  );
}
