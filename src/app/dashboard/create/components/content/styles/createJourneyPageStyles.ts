import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";

export const createJourneyPageStyles = {
  pageContainer: {
    minHeight: "100vh",
    bgcolor: "background.default",
    display: "flex",
    flexDirection: "column",
  },
  mainLayout: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  contentArea: {
    flex: 1,
    overflow: "auto",
    p: 4,
    width: "100%",
    bgcolor: "background.paper",
  },
  formContent: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    width: "100%",
  },
  filtersSection: {
    mt: 2,
  },
  sectionLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "text.secondary",
    mb: 1.5,
  },
  formCard: (theme: Theme): SxProps<Theme> => ({
    bgcolor: "background.paper",
    borderRadius: "12px",
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    boxShadow:
      theme.palette.mode === "light"
        ? THEME_COLORS.SHADOWS.light.sm
        : THEME_COLORS.SHADOWS.dark.sm,
  }),
};
export const loadingContainerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  my: 5,
};
