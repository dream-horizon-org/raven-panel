import { SxProps, Theme } from "@mui/material";

export const layoutContainerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  maxHeight: "100vh",
  overflow: "hidden",
  bgcolor: "background.default",
};

export const mainContainerStyles: SxProps<Theme> = {
  display: "flex",
  flex: 1,
  overflow: "hidden",
  minHeight: 0,
};

export const contentContainerStyles: SxProps<Theme> = {
  flex: 1,
  overflow: "hidden",
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
};
