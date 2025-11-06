import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";

export const filterRowStyles = {
  filterCard: (theme: Theme): SxProps<Theme> => ({
    bgcolor:
      theme.palette.mode === "light"
        ? THEME_COLORS.BACKGROUND.light.default
        : THEME_COLORS.BACKGROUND.dark.paper,
    borderRadius: "8px",
    border: 1,
    borderColor: theme.palette.divider,
    p: 2.5,
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "primary.main",
      boxShadow:
        theme.palette.mode === "light"
          ? THEME_COLORS.SHADOWS.light.md
          : THEME_COLORS.SHADOWS.dark.md,
    },
  }),
  filterFields: {
    display: "flex",
    gap: 2,
    alignItems: "flex-start",
  },
  filterField: {
    flex: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      bgcolor: "background.paper",
    },
  },
  deleteButton: {
    color: "text.secondary",
    mt: 0.5,
    "&:hover": {
      color: "error.main",
      bgcolor: "error.light",
    },
  },
};
