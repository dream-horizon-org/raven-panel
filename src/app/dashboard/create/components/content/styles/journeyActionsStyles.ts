import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";

export const journeyActionsStyles = {
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 2,
    mt: 4,
    pt: 3,
    borderTop: 1,
    borderColor: "divider",
    width: "100%",
    flexShrink: 0,
  },
  cancelButton: {
    textTransform: "none",
    color: "text.secondary",
    px: 3,
    borderRadius: "8px",
    "&:hover": {
      bgcolor: "action.hover",
    },
  },
  submitButton: (theme: Theme): SxProps<Theme> => ({
    textTransform: "none",
    px: 4,
    borderRadius: "8px",
    fontWeight: 600,
    boxShadow:
      theme.palette.mode === "light"
        ? THEME_COLORS.SHADOWS.light.lg
        : THEME_COLORS.SHADOWS.dark.lg,
    "&:hover": {
      boxShadow:
        theme.palette.mode === "light"
          ? THEME_COLORS.SHADOWS.light.xl
          : THEME_COLORS.SHADOWS.dark.xl,
    },
  }),
};
