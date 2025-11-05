import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";

export const headerStyles: SxProps<Theme> = {
  bgcolor: "background.paper",
  borderBottom: 1,
  borderColor: THEME_COLORS.GRAY["800"],
  px: 3,
  py: 2,
};

export const headerTitleStyles: SxProps<Theme> = {
  color: "text.primary",
  fontSize: "1.125rem",
  fontWeight: 500,
};
