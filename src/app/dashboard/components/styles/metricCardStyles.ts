import { SxProps, Theme } from "@mui/material";

export const metricCardStyles: SxProps<Theme> = (theme) => ({
  bgcolor: "background.paper",
  borderRadius: "16px",
  p: "24px",
  width: "316px",
  height: "102px",
  display: "flex",
  alignItems: "center",
  border: 1,
  borderColor: theme.palette.divider,
});

export const metricCardContentStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

export const metricCardIconContainerStyles = (
  iconColor: "purple" | "green"
): SxProps<Theme> => ({
  width: 54,
  height: 54,
  borderRadius: "0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: iconColor === "purple" ? "primary.main" : "secondary.main",
  "& .MuiSvgIcon-root": {
    color: "primary.contrastText",
  },
});

export const metricCardLabelStyles: SxProps<Theme> = {
  color: "text.secondary",
  fontSize: "0.875rem",
};

export const metricCardValueStyles: SxProps<Theme> = {
  color: "text.primary",
  fontSize: "1.5rem",
  fontWeight: 700,
  lineHeight: 1.2,
};
