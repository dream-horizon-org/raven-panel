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
    ml: 0,
  },
  eventFieldContainer: {
    display: "flex",
    gap: 2,
    alignItems: "flex-start",
  },
  eventField: {
    width: "30%",
    "& .MuiOutlinedInput-root": {
      height: "36px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
    },
    "& .MuiInputBase-input": {
      padding: "8px 14px",
      fontSize: "0.875rem",
      "&::placeholder": {
        opacity: 1,
        color: "text.secondary",
      },
    },
  },
  addFilterButton: {
    textTransform: "none",
    borderRadius: "8px",
    borderColor: "primary.main",
    color: "primary.main",
    height: "36px",
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
  filterRowContainer: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  },
  andChip: (theme: Theme): SxProps<Theme> => ({
    bgcolor:
      theme.palette.mode === "light"
        ? "rgba(165, 26, 253, 0.1)"
        : "rgba(165, 26, 253, 0.2)",
    color: "primary.main",
    fontWeight: 600,
    fontSize: "0.75rem",
    height: "24px",
    flexShrink: 0,
    "& .MuiChip-label": {
      px: 1.5,
    },
  }),
};
