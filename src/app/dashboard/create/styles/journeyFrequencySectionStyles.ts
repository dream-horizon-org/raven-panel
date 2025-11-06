import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";

export const journeyFrequencySectionStyles = {
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
    gap: 2,
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
  sectionTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
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
  frequencyRow: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    flexWrap: "wrap",
  },
  labelText: {
    fontSize: "0.875rem",
    color: "text.primary",
    whiteSpace: "nowrap",
  },
  numberInput: {
    width: "100px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
    },
    "& input": {
      textAlign: "center",
    },
  },
  periodUnitSelect: {
    minWidth: "100px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
    },
  },
};
