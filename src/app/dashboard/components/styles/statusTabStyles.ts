import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";

export const statusTabsContainerStyles: SxProps<Theme> = {
  mb: 1.5,
};

export const statusTabStyles: SxProps<Theme> = (theme) => ({
  textTransform: "none",
  color:
    theme.palette.mode === "light"
      ? THEME_COLORS.TEXT.light.primary
      : THEME_COLORS.TEXT.dark.primary,
  "&.Mui-selected": {
    color: "primary.main",
  },
});

export const statusTabLabelContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};
