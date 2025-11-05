import { SxProps, Theme } from "@mui/material";

export const layoutContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  bgcolor: "background.default",
};

export const mainContainerStyles: SxProps<Theme> = {
  display: "flex",
  flex: 1,
};

export const contentContainerStyles: SxProps<Theme> = {
  flex: 1,
};
