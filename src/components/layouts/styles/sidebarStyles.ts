import { SxProps, Theme } from "@mui/material";
import { THEME_COLORS } from "@/config/colors";

export const sidebarStyles = (isCollapsed: boolean): SxProps<Theme> => (
  theme
) => ({
  width: isCollapsed ? 64 : 240,
  bgcolor: theme.palette.mode === "light" ? "#f9fafb" : "#1a1a1a",
  borderRight: 1,
  borderColor: theme.palette.divider,
  display: "flex",
  flexDirection: "column",
  position: "relative",
  transition: "width 0.3s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "4px",
    bgcolor: "#10b981",
  },
});

export const sidebarLogoContainerStyles = (
  isCollapsed: boolean
): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  justifyContent: isCollapsed ? "center" : "flex-start",
  px: isCollapsed ? 0 : 2,
  py: 2,
  mb: 1,
  width: "100%",
});

export const sidebarLogoStyles: SxProps<Theme> = (theme) => ({
  width: 32,
  height: 32,
  bgcolor: "primary.main",
  borderRadius: "0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: 600,
});

export const sidebarLogoInnerStyles: SxProps<Theme> = (theme) => ({
  width: 24,
  height: 24,
  bgcolor:
    theme.palette.mode === "light"
      ? THEME_COLORS.GRAY["300"]
      : THEME_COLORS.GRAY["600"],
  borderRadius: 1,
});

export const sidebarNavStyles = (isCollapsed: boolean): SxProps<Theme> => ({
  flex: 1,
  overflowY: "auto",
  px: isCollapsed ? 0 : 1,
  display: "flex",
  flexDirection: "column",
  alignItems: isCollapsed ? "center" : "stretch",
});

export const sidebarNavItemStyles = (isCollapsed: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  justifyContent: isCollapsed ? "center" : "flex-start",
  gap: isCollapsed ? 0 : 1.5,
  width: isCollapsed ? "100%" : "100%",
});

export const sidebarNavItemActiveStyles = (
  isCollapsed: boolean
): SxProps<Theme> => ({
  bgcolor: "transparent",
  borderRadius: "0.5rem",
  py: 1,
  px: isCollapsed ? 0 : 1.5,
  mb: 0.5,
  width: isCollapsed ? "48px" : "100%",
  minHeight: isCollapsed ? "48px" : "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: isCollapsed ? "center" : "flex-start",
  "&:hover": {
    bgcolor: "action.hover",
  },
});

export const sidebarNavItemInactiveStyles = (
  isCollapsed: boolean
): SxProps<Theme> => ({
  py: 1,
  px: isCollapsed ? 0 : 1.5,
  mb: 0.5,
  borderRadius: "0.5rem",
  width: isCollapsed ? "48px" : "100%",
  minHeight: isCollapsed ? "48px" : "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: isCollapsed ? "center" : "flex-start",
  "&:hover": {
    bgcolor: "action.hover",
  },
});

export const sidebarNavIconStyles = (
  isActive: boolean,
  isCollapsed: boolean
): SxProps<Theme> => ({
  fontSize: "1.25rem",
  color: isActive ? "primary.main" : "text.primary",
  minWidth: "24px",
});

export const sidebarNavTextStyles = (
  isActive: boolean,
  isCollapsed: boolean
): SxProps<Theme> => ({
  fontSize: "0.875rem",
  fontWeight: isActive ? 600 : 400,
  color: isActive ? "primary.main" : "text.primary",
  whiteSpace: "nowrap",
});

export const sidebarNavTextActiveStyles: SxProps<Theme> = {
  color: "white",
};

export const sidebarBottomContainerStyles = (
  isCollapsed: boolean
): SxProps<Theme> => ({
  mt: "auto",
  px: isCollapsed ? 0 : 1,
  py: 2,
  display: "flex",
  justifyContent: isCollapsed ? "center" : "flex-start",
  alignItems: "center",
});

export const sidebarCollapseButtonStyles: SxProps<Theme> = (theme) => ({
  minWidth: "auto",
  width: "32px",
  height: "32px",
  borderRadius: "0.5rem",
  bgcolor: "primary.main",
  color: "white",
  "&:hover": {
    bgcolor: "primary.dark",
  },
});
