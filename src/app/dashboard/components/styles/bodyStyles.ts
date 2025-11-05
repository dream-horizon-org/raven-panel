import { SxProps, Theme } from "@mui/material";

export const bodyContainerStyles: SxProps<Theme> = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  bgcolor: "background.default",
  minHeight: "100vh",
};

export const bodyContentStyles: SxProps<Theme> = {
  flex: 1,
  p: 3,
};

export const bodyInnerStyles: SxProps<Theme> = {
  maxWidth: "100%",
  mx: "auto",
};

export const headerSectionStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  mb: 3,
};

export const titleStyles: SxProps<Theme> = {
  color: "text.primary",
  fontSize: "20px",
  fontWeight: 600,
};

export const createButtonStyles: SxProps<Theme> = {
  height: 40, // match TextField (40px)
  minHeight: 40,
  borderRadius: 1, // same radius as search
  px: 2, // remove vertical padding
  py: 0,
  display: "inline-flex",
  alignItems: "center",
  textTransform: "none",
};

export const metricsGridStyles: SxProps<Theme> = {
  display: "flex",
  gap: 2,
  mb: 3,
};

export const headerActionsContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 2,
};

export const searchContainerWrapperStyles: SxProps<Theme> = {
  width: 360,
};
