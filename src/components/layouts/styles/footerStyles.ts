import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";

export const footerStyles: SxProps<Theme> = {
  bgcolor: "background.paper",
  borderTop: 1,
  borderColor: THEME_COLORS.GRAY["800"],
  px: 3,
  py: 2,
  mt: "auto",
};

export const footerTextStyles: SxProps<Theme> = {
  color: "text.secondary",
  fontSize: "0.875rem",
  textAlign: "center",
};
