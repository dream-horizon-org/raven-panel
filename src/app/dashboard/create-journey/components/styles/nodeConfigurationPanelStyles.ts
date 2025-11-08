import { SxProps, Theme } from "@mui/material";

// Container styles
export const containerStyles: SxProps<Theme> = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

export const headerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

export const formContainerStyles: SxProps<Theme> = {
  flex: 1,
  overflowY: "auto",
};

export const eventNameContainerStyles = (hasEventName: boolean): SxProps<Theme> => ({
  mb: 3,
  mt: hasEventName ? 2 : 0,
});

export const eventNameInputStyles = (isEntry: boolean, hasValue: boolean): SxProps<Theme> => ({
  "& .MuiOutlinedInput-root": {
    ...(isEntry && !hasValue && {
      "& fieldset": {
        borderColor: "primary.main",
        borderWidth: 2,
      },
      "&:hover fieldset": {
        borderColor: "primary.main",
      },
      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
        borderWidth: 2,
      },
      animation: "pulse 2s ease-in-out infinite",
      "@keyframes pulse": {
        "0%, 100%": {
          boxShadow: "0 0 0 0 rgba(25, 118, 210, 0.4)",
        },
        "50%": {
          boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.1)",
        },
      },
    }),
  },
});

// Section header styles
export const sectionHeaderStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

export const sectionTitleStyles: SxProps<Theme> = {
  mb: 0.5,
};

// Engagement styles
export const engagementContainerStyles: SxProps<Theme> = {
  mb: 3,
};

export const engagementListStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export const engagementPaperStyles = (isHighlighted: boolean): SxProps<Theme> => ({
  border: "2px solid",
  borderColor: isHighlighted ? "primary.main" : "divider",
  borderRadius: 2,
  p: 2.5,
  bgcolor: isHighlighted ? "action.selected" : "background.paper",
  transition: "all 0.2s",
  elevation: isHighlighted ? 3 : 1,
});

export const engagementHeaderStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

export const engagementIconContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

export const engagementMenuItemStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

export const emptyEngagementBoxStyles = (isEntry: boolean, hasEventName: boolean): SxProps<Theme> => ({
  p: 2,
  textAlign: "center",
  bgcolor: isEntry && !hasEventName ? "action.disabledBackground" : "action.hover",
  borderRadius: 1,
  border: isEntry && !hasEventName ? "1px dashed" : "none",
  borderColor: isEntry && !hasEventName ? "divider" : "transparent",
});

// Branch/Transition styles
export const branchListStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export const branchPaperStyles = (shouldHighlight: boolean, isNewlyAdded: boolean): SxProps<Theme> => ({
  border: "2px solid",
  borderColor: shouldHighlight ? "primary.main" : "divider",
  borderRadius: 2,
  p: 2.5,
  bgcolor: shouldHighlight ? "action.selected" : "background.paper",
  transition: "all 0.2s",
  elevation: shouldHighlight ? 3 : 1,
  ...(shouldHighlight && {
    boxShadow: isNewlyAdded
      ? "0 4px 16px rgba(25, 118, 210, 0.5)"
      : "0 4px 12px rgba(25, 118, 210, 0.3)",
  }),
});

export const branchHeaderStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  mb: 2.5,
};

export const branchContentStyles: SxProps<Theme> = {
  flex: 1,
};

export const branchChipContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  mb: 1,
};

export const flowIndicatorStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  mt: 1.5,
  p: 1.5,
  bgcolor: "action.hover",
  borderRadius: 1,
};

export const flowStepStyles: SxProps<Theme> = {
  flex: 1,
};

export const emptyBranchBoxStyles = (isEntry: boolean, hasEventName: boolean): SxProps<Theme> => ({
  p: 3,
  textAlign: "center",
  bgcolor: isEntry && !hasEventName ? "action.disabledBackground" : "action.hover",
  borderRadius: 1,
  border: isEntry && !hasEventName ? "1px dashed" : "none",
  borderColor: isEntry && !hasEventName ? "divider" : "transparent",
});

// Condition/Filter styles
export const conditionsHeaderStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 1.5,
};

export const andLogicHeaderStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  mb: 2,
  p: 1.5,
  bgcolor: (theme: Theme) =>
    theme.palette.mode === "light"
      ? "rgba(25, 118, 210, 0.08)"
      : "rgba(144, 202, 249, 0.16)",
  borderRadius: 1,
  border: "1px solid",
  borderColor: (theme: Theme) =>
    theme.palette.mode === "light"
      ? "rgba(25, 118, 210, 0.2)"
      : "rgba(144, 202, 249, 0.3)",
};

export const andLogicIconStyles: SxProps<Theme> = {
  fontSize: 18,
  color: "primary.main",
};

export const andConnectorStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  my: 1.5,
  position: "relative",
};

export const andConnectorLineStyles: SxProps<Theme> = {
  flex: 1,
  height: "1px",
  bgcolor: "divider",
};

export const andBadgeStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  px: 1.5,
  py: 0.5,
  bgcolor: "primary.main",
  color: "white",
  borderRadius: 2,
  boxShadow: 1,
};

export const conditionCardStyles: SxProps<Theme> = {
  p: 1.5,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  bgcolor: "background.paper",
  position: "relative",
  "&:hover": {
    borderColor: "primary.main",
    boxShadow: 1,
  },
  transition: "all 0.2s",
};

export const conditionHeaderStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  mb: 1,
};

export const filterEditorStyles: SxProps<Theme> = {
  display: "flex",
  gap: 2,
  alignItems: "flex-start",
};

export const filterPropertyFieldStyles: SxProps<Theme> = {
  flex: 2,
};

export const filterOperatorFieldStyles: SxProps<Theme> = {
  flex: 1,
  minWidth: 120,
};

export const filterValueFieldStyles: SxProps<Theme> = {
  flex: 2,
};

export const filterDeleteButtonStyles: SxProps<Theme> = {
  mt: 0.5,
};

export const emptyConditionsBoxStyles: SxProps<Theme> = {
  p: 1.5,
  textAlign: "center",
  bgcolor: "action.hover",
  borderRadius: 1,
};

// Action buttons styles
export const actionButtonsContainerStyles: SxProps<Theme> = {
  display: "flex",
  gap: 1,
};

export const actionButtonStyles: SxProps<Theme> = {
  flex: 1,
};

// Dialog styles
export const dialogTitleContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
};

export const dialogTitleIconStyles: SxProps<Theme> = {
  color: "warning.main",
  fontSize: 28,
};

export const dialogContentTextStyles: SxProps<Theme> = {
  fontSize: "0.95rem",
  lineHeight: 1.6,
  color: "text.primary",
  mb: 1,
};

export const dialogActionsStyles: SxProps<Theme> = {
  p: 2.5,
  pt: 1,
};

// Divider styles
export const sectionDividerStyles: SxProps<Theme> = {
  my: 3,
};

export const branchDividerStyles: SxProps<Theme> = {
  my: 2,
};

export const footerDividerStyles: SxProps<Theme> = {
  my: 2,
};

