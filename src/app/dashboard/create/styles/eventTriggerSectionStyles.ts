import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";

export const eventTriggerSectionStyles = {
  filtersCard: (theme: Theme): SxProps<Theme> => ({
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
    mb: 2.5,
    "&:last-child": {
      mb: 0,
    },
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
  fieldInfoIcon: {
    fontSize: "1rem",
    color: "primary.main",
    cursor: "help",
  },
  fieldSubtext: {
    fontSize: "0.75rem",
    color: "text.secondary",
    ml: 4.25,
  },
  eventFieldContainer: {
    display: "flex",
    gap: 2,
    alignItems: "flex-start",
  },
  eventField: {
    flex: 1,
  },
  addFilterButton: {
    textTransform: "none",
    borderRadius: "8px",
    borderColor: "primary.main",
    color: "primary.main",
    mt: 1.5,
    "&:hover": {
      borderColor: "primary.dark",
      bgcolor: "primary.light",
      color: "primary.dark",
    },
  },
  operatorSection: {
    mb: 2,
    display: "flex",
    alignItems: "center",
  },
  filtersList: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
};
