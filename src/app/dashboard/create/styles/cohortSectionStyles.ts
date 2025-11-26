import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";
export const cohortSectionStyles = {
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
    mb: 2.5,
    "&:last-child": {
      mb: 0,
    },
  },
  fieldHeader: {
    mb: 2,
  },
  fieldHeaderContent: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 0.75,
  },
  fieldHeaderIcon: {
    fontSize: "1.25rem",
    fieldSubtext: {
      fontSize: "0.75rem",
      color: "text.secondary",
      ml: 0,
    },
    selectContainer: {
      display: "flex",
      alignItems: "center",
      gap: 1.5,
    },
    selectLabel: {
      fontSize: "0.875rem",
      color: "text.primary",
      whiteSpace: "nowrap",
    },
    selectField: {
      width: "200px",
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        height: "36px",
      },
      "& .MuiSelect-select": {
        padding: "8px 14px",
        fontSize: "0.875rem",
      },
    },
    separator: (theme: Theme): SxProps<Theme> => ({
      borderTop: "1px dashed",
      borderColor: theme.palette.divider,
      mt: 2.5,
      width: "100%",
    }),
  },
  fieldLabel: (theme: Theme): SxProps<Theme> => ({
    fontSize: "16px",
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
    fontSize: "14px",
    color: "text.secondary",
    ml: 4.25,
  },
  selectContainer: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  },
  selectLabel: {
    fontSize: "0.875rem",
    color: "text.primary",
    whiteSpace: "nowrap",
  },
  selectField: {
    width: "200px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      height: "36px",
    },
    "& .MuiSelect-select": {
      padding: "8px 14px",
      fontSize: "0.875rem",
    },
  },
};
