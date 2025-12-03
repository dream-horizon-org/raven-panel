"use client";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BottomSheetIcon from "@mui/icons-material/ViewAgenda";
import PopupIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureInPictureIcon from "@mui/icons-material/PictureInPicture";
import HighlightIcon from "@mui/icons-material/Highlight";
import {
  Control,
  FieldErrors,
  useFieldArray,
  useWatch,
  useFormContext,
} from "react-hook-form";
import {
  CreateJourneyFormData,
  NudgeType,
  NudgeSelectionTooltipMenu,
  ReactNativeJson,
} from "../types/journeyTypes";
import { engagementSelectorStyles } from "../styles/engagementSelectorStyles";
import { generateTemplate } from "./content/TemplateTab";
import { useState } from "react";

interface EngagementSelectorProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  onEngagementSelect: (type: NudgeType) => void;
}

const ENGAGEMENT_TYPES: {
  value: NudgeType | string;
  label: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}[] = [
  {
    value: NudgeType.TOOLTIP,
    label: "Tooltip",
    description: "Small contextual hints near UI elements",
    icon: <InfoOutlinedIcon />,
  },
  {
    value: NudgeType.NUDGE_UI,
    label: "BottomSheet",
    description: "Slide-up panel from bottom",
    icon: <BottomSheetIcon />,
  },
  {
    value: NudgeType.POPUP,
    label: "Popup",
    description: "Modal dialog in center of screen",
    icon: <PopupIcon />,
  },
  {
    value: "PICTURE_IN_PICTURE",
    label: "Picture-in-Picture",
    description: "Overlay video or content in corner",
    icon: <PictureInPictureIcon />,
    comingSoon: true,
  },
  {
    value: "ELEMENT_SPOTLIGHT",
    label: "Element Spotlight",
    description: "Highlight and focus on specific elements",
    icon: <HighlightIcon />,
    comingSoon: true,
  },
];

export default function EngagementSelector({
  control,
  errors,
  onEngagementSelect,
}: EngagementSelectorProps) {
  const { setValue } = useFormContext<CreateJourneyFormData>();
  const { fields, append } = useFieldArray({
    control,
    name: "nudgeSelection.actions",
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNewType, setPendingNewType] = useState<NudgeType | null>(null);

  const currentAction = fields.length > 0 ? fields[0] : null;
  const selectedType = useWatch({
    control,
    name: "nudgeSelection.actions.0.type",
  }) as NudgeType | undefined;

  const template = useWatch({
    control,
    name: "nudgeSelection.actions.0.template",
  }) as ReactNativeJson | undefined;

  // Check if template has content (children or other data)
  const hasTemplateData =
    template &&
    ((template.children && template.children.length > 0) ||
    (template.props && Object.keys(template.props).length > 1) || // More than just testID
      (template.styles && Object.keys(template.styles).length > 0));

  const handleTypeChange = (newType: NudgeType) => {
    if (currentAction) {
      const previousType = currentAction.type;

      if (previousType !== newType) {
        if (newType === NudgeType.TOOLTIP) {
          const defaultVariant = "basic-tooltip";
          const freshTemplate = generateTemplate(newType, defaultVariant);
          setValue("nudgeSelection.actions.0.template", freshTemplate);
          setValue(
            "nudgeSelection.actions.0.variant",
            (defaultVariant as unknown) as NudgeSelectionTooltipMenu
          );
          setValue("nudgeSelection.actions.0.isNudgeValid", true);
        } else {
          // For other types, create empty template
          const freshTemplate: ReactNativeJson = {
            type: newType,
            props: { testID: `testID-${Date.now()}` },
            actions: [],
            styles: {},
            children: [],
          };
          setValue("nudgeSelection.actions.0.template", freshTemplate);
          setValue("nudgeSelection.actions.0.variant", undefined);
          setValue("nudgeSelection.actions.0.isNudgeValid", false);
        }
      }

      // Update the type
      setValue("nudgeSelection.actions.0.type", newType);
    } else {
      // Only generate default template for TOOLTIP
      if (newType === NudgeType.TOOLTIP) {
        const defaultVariant = "basic-tooltip";
        const freshTemplate = generateTemplate(newType, defaultVariant);
        append({
          config: {
            triggerDelay: 0,
          },
          onState: "",
          actionId: "",
          type: newType,
          template: freshTemplate,
          variant: (defaultVariant as unknown) as NudgeSelectionTooltipMenu,
          isNudgeValid: true,
        });
      } else {
        // For other types, create empty template
        const freshTemplate: ReactNativeJson = {
          type: newType,
          props: { testID: `testID-${Date.now()}` },
          actions: [],
          styles: {},
          children: [],
        };
        append({
          config: {
            triggerDelay: 0,
          },
          onState: "",
          actionId: "",
          type: newType,
          template: freshTemplate,
          variant: undefined,
          isNudgeValid: false,
        });
      }
    }
    onEngagementSelect(newType);
  };

  const handleCardClick = (type: NudgeType | string) => {
    // Don't handle clicks for coming soon types
    if (type === "PICTURE_IN_PICTURE" || type === "ELEMENT_SPOTLIGHT") {
      return;
    }

    const nudgeType = type as NudgeType;
    if (selectedType === nudgeType && hasTemplateData) {
      // If already selected and has data, open editor
      onEngagementSelect(nudgeType);
    } else if (selectedType && selectedType !== nudgeType) {
      setPendingNewType(nudgeType);
      setShowConfirmDialog(true);
    } else {
      handleTypeChange(nudgeType);
    }
  };

  const handleConfirmChange = () => {
    if (pendingNewType) {
      handleTypeChange(pendingNewType);
      setPendingNewType(null);
    }
    setShowConfirmDialog(false);
  };

  const handleCancelChange = () => {
    setPendingNewType(null);
    setShowConfirmDialog(false);
  };

  const getEngagementLabel = (type: NudgeType | undefined): string => {
    if (!type) return "";
    const engagement = ENGAGEMENT_TYPES.find((e) => e.value === type);
    return engagement?.label || type;
  };

  return (
    <Box sx={engagementSelectorStyles.container}>
      <Typography sx={engagementSelectorStyles.title}>
        Select Engagement
      </Typography>
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 5,
        }}
      >
        {ENGAGEMENT_TYPES.map((engagementType) => {
          const isSelected = selectedType === engagementType.value;
          const isSelectedWithData = isSelected && hasTemplateData;
          const isComingSoon = engagementType.comingSoon;

          return (
            <Card
              key={engagementType.value}
              onClick={() => {
                if (!isComingSoon) {
                  handleCardClick(engagementType.value as NudgeType);
                }
              }}
              sx={{
                cursor: isComingSoon ? "default" : "pointer",
                position: "relative",
                border: 1.5,
                borderColor: isSelected ? "primary.main" : "divider",
                borderRadius: 2,
                bgcolor: isSelected ? "action.selected" : "background.paper",
                transition: "all 0.2s ease-in-out",
                overflow: "visible",
                "&:hover": {
                  transform: isComingSoon ? "none" : "translateY(-2px)",
                  boxShadow: isComingSoon ? 2 : 3,
                  borderColor: isSelected ? "primary.main" : "primary.light",
                },
                ...(isSelected && {
                  boxShadow: 2,
                }),
              }}
            >
              {isSelected && !isComingSoon && (
                <Chip
                  icon={
                    <CheckCircleIcon sx={{ fontSize: "0.875rem !important" }} />
                  }
                  label="Selected"
                  color="primary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: 12,
                    fontWeight: 600,
                    fontSize: "0.688rem",
                    height: "20px",
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              )}
              {isComingSoon && (
                <Chip
                  label="Coming Soon"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: 12,
                    fontWeight: 700,
                    fontSize: "0.688rem",
                    height: "22px",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": {
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                        transform: "scale(1)",
                      },
                      "50%": {
                        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.6)",
                        transform: "scale(1.05)",
                      },
                    },
                    "& .MuiChip-label": {
                      px: 1.5,
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                    },
                  }}
                />
              )}
              <CardContent
                sx={{
                  p: 2,
                  "&:last-child": { pb: 2 },
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    color: isSelected ? "primary.main" : "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: isSelected ? "primary.light" : "action.hover",
                    transition: "all 0.2s ease-in-out",
                    "& svg": {
                      fontSize: "1.5rem",
                    },
                  }}
                >
                  {engagementType.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: isSelected ? "primary.main" : "text.primary",
                      fontSize: "0.938rem",
                      mb: 0.5,
                    }}
                  >
                    {engagementType.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {engagementType.description}
                  </Typography>
                </Box>
                {isSelectedWithData && !isComingSoon && (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      py: 0.5,
                      px: 1.5,
                      minWidth: "auto",
                      alignSelf: "center",
                      ml: "auto",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEngagementSelect(engagementType.value as NudgeType);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {errors.nudgeSelection?.actions?.[0]?.type && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 3, display: "block" }}
        >
          {errors.nudgeSelection.actions[0].type.message}
        </Typography>
      )}

      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelChange}
        aria-labelledby="engagement-change-dialog-title"
        aria-describedby="engagement-change-dialog-description"
      >
        <DialogTitle id="engagement-change-dialog-title">
          Change Engagement Type
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="engagement-change-dialog-description">
            You are about to change the engagement type from{" "}
            <strong>{getEngagementLabel(selectedType)}</strong> to{" "}
            <strong>{getEngagementLabel(pendingNewType || undefined)}</strong>.
            <br />
            <br />
            The previous engagement will be removed and all its configuration
            will be lost. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelChange}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirmChange}
            color="primary"
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
