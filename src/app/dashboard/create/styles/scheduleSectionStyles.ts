import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";

export const scheduleSectionStyles = {
  formCard: (theme: Theme): SxProps<Theme> => ({
    bgcolor: "background.paper",
    borderRadius: "12px",
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    boxShadow:
      theme.palette.mode === "light"
        ? THEME_COLORS.SHADOWS.light.sm
        : THEME_COLORS.SHADOWS.dark.sm,
  }),
  formSection: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  dateTimeSection: {
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
  },
  fieldHeader: {
    mb: 1.5,
  },
  fieldHeaderContent: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 0.5,
  },
  fieldHeaderIcon: {
    fontSize: "1.25rem",
    color: "text.primary",
  },
  fieldLabel: (theme: Theme): SxProps<Theme> => ({
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "text.primary",
    bgcolor:
      theme.palette.mode === "light"
        ? THEME_COLORS.LABEL.light.bg
        : THEME_COLORS.LABEL.dark.bg,
    px: 1,
    py: 0.25,
    borderRadius: "4px",
  }),
  fieldSubtext: {
    fontSize: "0.75rem",
    color: "text.secondary",
    ml: 0,
  },
  sectionTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 0.5,
  },
  sectionIcon: {
    fontSize: "1.25rem",
    color: "text.primary",
  },
  sectionTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "text.primary",
  },
  sectionDescription: {
    fontSize: "0.75rem",
    color: "text.secondary",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  dateTimeFields: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    flexWrap: "wrap",
  },
  dateField: {
    minWidth: "150px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
    },
  },
  timeField: {
    minWidth: "120px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
    },
  },
  dateTimeLabel: {
    fontSize: "0.875rem",
    color: "text.secondary",
    whiteSpace: "nowrap",
  },
  timezoneText: {
    fontSize: "0.75rem",
    color: "text.secondary",
    whiteSpace: "nowrap",
  },
};
