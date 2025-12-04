import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";

export const journeyTabsStyles = {
  tabsContainer: {
    display: "flex",
    alignItems: "stretch",
    gap: 1.5,
    mb: 3,
    width: "100%",
  },
  customTab: (_isActive: boolean, theme: Theme): SxProps<Theme> => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 1.25,
    px: 3,
    py: 1.25,
    borderRadius: "8px",
    cursor: "pointer",
    bgcolor: _isActive
      ? theme.palette.mode === "light"
        ? THEME_COLORS.GRAY["100"]
        : THEME_COLORS.GRAY["700"]
      : "background.paper",
    border: 0,
    transition: "all 0.2s ease",
    flex: 1,
    "&:hover": {
      bgcolor: _isActive
        ? theme.palette.mode === "light"
          ? THEME_COLORS.GRAY["200"]
          : THEME_COLORS.GRAY["600"]
        : theme.palette.mode === "light"
        ? THEME_COLORS.BACKGROUND.light.default
        : THEME_COLORS.GRAY["800"],
    },
  }),
  tabIcon: (): SxProps<Theme> => ({
    fontSize: "1.125rem",
    color: "text.primary",
  }),
  tabText: (isActive: boolean): SxProps<Theme> => ({
    fontSize: "0.875rem",
    fontWeight: isActive ? 600 : 400,
    color: "text.primary",
    whiteSpace: "nowrap",
  }),
  tabArrow: {
    fontSize: "0.75rem",
    color: "text.primary",
    ml: 0.5,
  },
};
