"use client";

import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Button,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
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
import { useState, useEffect, useRef } from "react";
import TemplateTab from "./content/TemplateTab";
import ContentTab from "./content/ContentTab";
import LocationTab from "./content/LocationTab";
import PreviewPanel from "./content/PreviewPanel";
import { engagementSidePanelStyles } from "./content/styles/engagementSidePanelStyles";
import { validateTemplate } from "../utils/validation";
import { ElementLocatorProvider } from "../contexts/ElementLocatorContext";

interface EngagementSidePanelProps {
  open: boolean;
  onClose: () => void;
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  onTemplateSaved?: () => void;
}

export default function EngagementSidePanel({
  open,
  onClose,
  control,
  errors,
  onTemplateSaved,
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

  useEffect(() => {
    if (open) {
      setActiveSubTab("template");
    }
  }, [open]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<
    (() => void) | null
  >(null);
  const initialTemplateRef = useRef<ReactNativeJson | null>(null);

  // Use formState.errors for reactive updates (errors set by setError will appear here)
  // Use formErrors if available, otherwise fall back to errors prop
  const errorSource = formState.errors as FieldErrors<CreateJourneyFormData>;

  const actions = useWatch({
    control,
    name: "nudgeSelection.actions",
  });
  const engagementType = actions?.[0]?.type;
  const isTooltip = engagementType === NudgeType.TOOLTIP;

  useEffect(() => {
    if (open) {
      const currentData = getValues();
      const currentTemplate =
        currentData.nudgeSelection?.actions?.[0]?.template;
      initialTemplateRef.current = currentTemplate
        ? JSON.parse(JSON.stringify(currentTemplate))
        : null;
    }
  }, [open, getValues]);

  // Helper to get nested error from errors object
  // const getNestedError = (path: string) => {
  //   const pathParts = path.split(".");
  //   let current: Record<string, unknown> | unknown = errorSource;
  //   for (const part of pathParts) {
  //     if (current && typeof current === "object" && !Array.isArray(current)) {
  //       const index = parseInt(part, 10);
  //       if (!isNaN(index) && part === String(index)) {
  //         if (part in current) {
  //           current = (current as Record<string, unknown>)[part];
  //         } else {
  //           return undefined;
  //         }
  //       } else if (part in current) {
  //         current = (current as Record<string, unknown>)[part];
  //       } else {
  //         return undefined;
  //       }
  //     } else {
  //       return undefined;
  //     }
  //   }
  //   return current;
  // };

  const hasErrorsInPath = (path: string): boolean => {
    const value = get(errorSource, path);
    if (!value) return false;

    if (typeof value === "object" && "message" in value) return true; // nested object/array – check recursively
    if (typeof value === "object") {
      return Object.keys(value as Record<string, unknown>).some((key) =>
        hasErrorsInPath(`${path}.${key}`)
      );
    }

    return false;
  };

  // Content tab
  const hasContentErrors = (): boolean => {
    if (isTooltip) {
      const props = get(
        errorSource,
        "nudgeSelection.actions.0.template.props"
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

      return hasErrorsInPath("nudgeSelection.actions.0.template.styles");
    }

    return hasErrorsInPath("nudgeSelection.actions.0.template.children");
  };

  const hasLocationErrors = (): boolean => {
    if (!isTooltip) return false;

    return (
      !!get(
        errorSource,
        "nudgeSelection.actions.0.template.props.targetScreen"
      ) ||
      !!get(errorSource, "nudgeSelection.actions.0.template.props.targetId")
    );
  };

  const handleSave = () => {
    const data = getValues();
    if (!data.nudgeSelection?.actions?.[0]?.template) {
      onClose();
      return;
    }

    const template = data.nudgeSelection.actions[0].template;
    const basePath = "nudgeSelection.actions.0.template" as Path<
      CreateJourneyFormData
    >;

    const isValid = validateTemplate(template, basePath, setError, clearErrors);

    if (isValid) {
      // Notify parent that template was saved successfully
      // This will trigger re-validation in parent component
      if (onTemplateSaved) {
        onTemplateSaved();
      }
      // Update initial template ref to current state after successful save
      initialTemplateRef.current = JSON.parse(JSON.stringify(template));
      onClose();
    } else {
      // If validation failed, navigate to the tab with errors
      setTimeout(() => {
        const locationHasErrors = hasLocationErrors();
        const contentHasErrors = hasContentErrors();

        if (locationHasErrors) {
          setActiveSubTab("location");
        } else if (contentHasErrors) {
          setActiveSubTab("content");
        }
        // If no specific tab errors, stay on current tab
      }, 100);
    }
  };

  const handleDiscard = () => {
    // Reset template to initial state
    if (initialTemplateRef.current) {
      setValue("nudgeSelection.actions.0.template", initialTemplateRef.current);
    } else {
      // If no initial template, clear it
      setValue(
        "nudgeSelection.actions.0.template",
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

  const handleCloseRequest = (closeAction: () => void) => {
    const currentData = getValues();
    const currentTemplate = currentData.nudgeSelection?.actions?.[0]?.template;
    const initialTemplate = initialTemplateRef.current;

    // Check if template has been modified
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

  const handleConfirmDiscard = () => {
    handleDiscard();
  };

  const handleDialogCancel = () => {
    setShowConfirmDialog(false);
    setPendingCloseAction(null);
    // Keep panel open when canceling
  };

  const handleContinueEditing = () => {
    // Close the dialog and keep the panel open for editing
    setShowConfirmDialog(false);
    setPendingCloseAction(null);
    // Panel remains open, user can continue editing
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
              Configure Engagement:{" "}
              {engagementType ? String(engagementType) : "Select Type"}
            </Typography>
            <IconButton
              onClick={() => handleCloseRequest(onClose)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <ElementLocatorProvider>
            <Box sx={engagementSidePanelStyles.content}>
              <Box sx={engagementSidePanelStyles.previewSection}>
                <PreviewPanel control={control} />
              </Box>

              <Box sx={engagementSidePanelStyles.configSection}>
                <Tabs
                  value={activeSubTab}
                  onChange={(_, newValue) => setActiveSubTab(newValue)}
                  sx={engagementSidePanelStyles.tabs}
                >
                  <Tab value="template" label="Template" />
                  <Tab
                    value="content"
                    label={
                      <Box
                        component="span"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: hasContentErrors() ? "error.main" : "inherit",
                        }}
                      >
                        Content
                        {hasContentErrors() && (
                          <ErrorIcon
                            sx={{
                              fontSize: "1.2rem",
                              color: "error.main",
                            }}
                          />
                        )}
                      </Box>
                    }
                  />
                  {isTooltip && (
                    <Tab
                      value="location"
                      label={
                        <Badge
                          color="error"
                          variant="dot"
                          invisible={!hasLocationErrors()}
                          sx={{ "& .MuiBadge-badge": { right: -8, top: 8 } }}
                        >
                          <Box
                            component="span"
                            sx={{
                              color: hasLocationErrors()
                                ? "error.main"
                                : "inherit",
                            }}
                          >
                            Location
                          </Box>
                        </Badge>
                      }
                    />
                  )}
                </Tabs>

                <Box sx={engagementSidePanelStyles.tabContent}>
                  {activeSubTab === "template" && (
                    <TemplateTab control={control} errors={errors} />
                  )}
                  {activeSubTab === "content" && (
                    <ContentTab control={control} errors={errors} />
                  )}
                  {activeSubTab === "location" && isTooltip && (
                    <LocationTab control={control} errors={errors} />
                  )}
                </Box>
              </Box>
            </Box>

            <Box sx={engagementSidePanelStyles.footer}>
              <Button
                variant="outlined"
                onClick={() => handleCloseRequest(onClose)}
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </ElementLocatorProvider>
        </Box>
      </Drawer>

      <Dialog
        open={showConfirmDialog}
        onClose={handleDialogCancel}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            You have unsaved changes to the engagement template. If you close
            without saving, all your changes will be lost and the template will
            be reset.
            <br />
            <br />
            Would you like to save your changes before closing?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmDiscard}
            color="error"
            variant="outlined"
          >
            Discard
          </Button>
          <Button
            onClick={handleContinueEditing}
            color="primary"
            variant="outlined"
          >
            Continue Editing
          </Button>
          <Button
            onClick={handleConfirmSave}
            color="primary"
            variant="contained"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
