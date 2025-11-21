"use client";

import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Control,
  FieldErrors,
  Controller,
  FieldValues,
  useFieldArray,
  useWatch,
  useFormContext,
} from "react-hook-form";
import {
  CreateJourneyFormData,
  NudgeType,
  ReactNativeJson,
} from "../types/journeyTypes";
import { engagementSelectorStyles } from "../styles/engagementSelectorStyles";
import { generateTemplate } from "./content/TemplateTab";

interface EngagementSelectorProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  onEngagementSelect: (type: NudgeType) => void;
}

const ENGAGEMENT_TYPES: { value: NudgeType; label: string }[] = [
  { value: NudgeType.TOOLTIP, label: "Tooltip" },
  { value: NudgeType.NUDGE_UI, label: "BottomSheet" },
  { value: NudgeType.POPUP, label: "Popup" },
];

const getEngagementLabel = (type: NudgeType): string => {
  const typeMap: Record<NudgeType, string> = {
    [NudgeType.TOOLTIP]: "Tooltip",
    [NudgeType.NUDGE_UI]: "BottomSheet",
    [NudgeType.POPUP]: "Popup",
  };
  return typeMap[type] || type;
};

export default function EngagementSelector({
  control,
  errors,
  onEngagementSelect,
}: EngagementSelectorProps) {
  const { setValue } = useFormContext<CreateJourneyFormData>();
  const { fields, append, replace } = useFieldArray({
    control,
    name: "nudgeSelection.actions",
  });

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

      // Always reset template when changing engagement type
      // This ensures old template data from previous type doesn't persist
      if (previousType !== newType) {
        // Only generate default template for TOOLTIP
        if (newType === NudgeType.TOOLTIP) {
          const defaultVariant = "basic-tooltip";
          const freshTemplate = generateTemplate(newType, defaultVariant);
          setValue("nudgeSelection.actions.0.template", freshTemplate);
          setValue("nudgeSelection.actions.0.variant", defaultVariant as any);
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
          variant: defaultVariant as any,
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

  const handleSelectedEngagementClick = () => {
    if (selectedType) {
      onEngagementSelect(selectedType);
    }
  };

  // If engagement is selected and has template data, show as button with dropdown option
  if (selectedType && hasTemplateData) {
    return (
      <Box sx={engagementSelectorStyles.container}>
        <Typography sx={engagementSelectorStyles.title}>
          Selected Engagement
        </Typography>
        <Typography sx={engagementSelectorStyles.subtitle}>
          Click to view or edit the configured engagement
        </Typography>
        <Box sx={{ mt: 3, maxWidth: 400, display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ textTransform: "none" }}
            onClick={handleSelectedEngagementClick}
          >
            Selected Engagement: {getEngagementLabel(selectedType)}
          </Button>
          <Controller
            name="nudgeSelection.actions.0.type"
            control={control}
            render={({ field }: { field: FieldValues }) => (
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Change Type</InputLabel>
                <Select
                  value={field.value || ""}
                  label="Change Type"
                  onChange={(e) => {
                    const newType = e.target.value as NudgeType;
                    handleTypeChange(newType);
                  }}
                >
                  {ENGAGEMENT_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>
      </Box>
    );
  }

  // Show dropdown if no engagement selected or no template data
  return (
    <Box sx={engagementSelectorStyles.container}>
      <Typography sx={engagementSelectorStyles.title}>
        Select Engagement Type
      </Typography>
      <Typography sx={engagementSelectorStyles.subtitle}>
        Choose the type of engagement you want to configure
      </Typography>
      <Controller
        name={
          currentAction
            ? `nudgeSelection.actions.0.type`
            : "nudgeSelection.actions"
        }
        control={control}
        render={({ field }: { field: FieldValues }) => (
          <FormControl fullWidth sx={{ mt: 3, maxWidth: 400 }}>
            <InputLabel>Engagement Type</InputLabel>
            <Select
              value={currentAction ? field.value : ""}
              label="Engagement Type"
              onChange={(e) => {
                const selectedType = e.target.value as NudgeType;
                handleTypeChange(selectedType);
              }}
            >
              {ENGAGEMENT_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {errors.nudgeSelection?.actions?.[0]?.type && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.5 }}
              >
                {errors.nudgeSelection.actions[0].type.message}
              </Typography>
            )}
          </FormControl>
        )}
      />
    </Box>
  );
}
