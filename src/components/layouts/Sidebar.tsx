"use client";

import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  SvgIconProps,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import {
  sidebarStyles,
  sidebarLogoContainerStyles,
  sidebarLogoStyles,
  sidebarNavStyles,
  sidebarNavItemStyles,
  sidebarNavItemActiveStyles,
  sidebarNavItemInactiveStyles,
  sidebarNavIconStyles,
  sidebarNavTextStyles,
  sidebarCollapseButtonStyles,
} from "./styles/sidebarStyles";
import { useThemeMode } from "@/app/providers/ThemeModeProvider";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/Auth/hooks/useAuth";
import { useTheme } from "@mui/material/styles";

interface UserInfo {
  name?: string;
  email?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

const getUserInfo = (): UserInfo | null => {
  try {
    const userData = localStorage.getItem("google_user");
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  return null;
};

const getUserInitials = (user: UserInfo | null): string => {
  if (!user) return "";

  if (user.name) {
    const names = user.name.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  if (user.given_name && user.family_name) {
    return (user.given_name[0] + user.family_name[0]).toUpperCase();
  }

  if (user.given_name) {
    return user.given_name[0].toUpperCase();
  }

  if (user.email) {
    return user.email[0].toUpperCase();
  }

  return "U";
};

interface NavItem {
  label: string;
  icon: React.ComponentType<SvgIconProps>;
  path?: string;
}

export default function Sidebar() {
  const { mode, toggleThemeMode } = useThemeMode();
  const theme = useTheme();
  const { isAuthenticated, handleSignOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setUserInfo(getUserInfo());
    } else {
      setUserInfo(null);
    }
  }, [isAuthenticated]);

  const navItems: NavItem[] = [
    { label: "Journeys", icon: RouteIcon, path: "/dashboard" },
  ];

  const getActiveItem = (item: NavItem): boolean => {
    if (item.path === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname?.startsWith(item.path || "") ?? false;
  };

  return (
    <Box component="aside" sx={sidebarStyles(isCollapsed)}>
      <Box sx={sidebarLogoContainerStyles(isCollapsed)}>
        {!isCollapsed ? (
          <>
            <Box sx={sidebarLogoStyles}>
              <Typography
                sx={{ fontWeight: 600, fontSize: "1.25rem", color: "white" }}
              >
                R
              </Typography>
            </Box>
            <Typography
              sx={{ ml: 1.5, fontWeight: 600, fontSize: "1rem", flex: 1 }}
            >
              Raven
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsCollapsed(true)}
              sx={sidebarCollapseButtonStyles}
            >
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={() => setIsCollapsed(false)}
            sx={{
              minWidth: "48px",
              width: "48px",
              height: "48px",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1.25rem",
                color: "primary.main",
              }}
            >
              R
            </Typography>
          </IconButton>
        )}
      </Box>

      <Box component="nav" sx={sidebarNavStyles(isCollapsed)}>
        <List
          sx={{
            p: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: isCollapsed ? "center" : "stretch",
          }}
        >
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = getActiveItem(item);
            return (
              <ListItem
                key={item.label}
                sx={
                  isActive
                    ? sidebarNavItemActiveStyles(isCollapsed)
                    : sidebarNavItemInactiveStyles(isCollapsed)
                }
                onClick={() => {
                  if (item.path) {
                    router.push(item.path);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <Box sx={sidebarNavItemStyles(isCollapsed)}>
                  <IconComponent
                    sx={sidebarNavIconStyles(isActive, isCollapsed)}
                  />
                  {!isCollapsed && (
                    <Typography
                      sx={sidebarNavTextStyles(isActive, isCollapsed)}
                    >
                      {item.label}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box
        sx={{
          mt: "auto",
          px: isCollapsed ? 0 : 1.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        {!isCollapsed ? (
          <>
            <IconButton
              onClick={toggleThemeMode}
              sx={{
                py: 1,
                px: 1.5,
                borderRadius: "0.5rem",
                width: "100%",
                justifyContent: "flex-start",
                color: "text.primary",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              <Typography sx={{ ml: 1.5, fontSize: "0.875rem" }}>
                {mode === "light" ? "Dark Mode" : "Light Mode"}
              </Typography>
            </IconButton>
            {isAuthenticated && (
              <>
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                  }}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    py: 0.5,
                    px: 1,
                    borderRadius: "0.5rem",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {userInfo?.picture ? (
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                      }}
                      src={userInfo.picture}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: theme.palette.primary.main,
                      }}
                    />
                  )}
                  {userInfo?.name && (
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: "text.primary",
                        fontWeight: 400,
                        flex: 1,
                      }}
                    >
                      {userInfo.name}
                    </Typography>
                  )}
                  <ChevronRightIcon
                    sx={{
                      fontSize: "1.25rem",
                      color: "text.secondary",
                    }}
                  />
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      bgcolor: "background.paper",
                      border: 1,
                      borderColor: "divider",
                      boxShadow: 2,
                    },
                  }}
                >
                  {userInfo?.name && (
                    <MenuItem disabled>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {userInfo.name}
                      </Typography>
                    </MenuItem>
                  )}
                  {userInfo?.email && (
                    <MenuItem disabled>
                      <Typography variant="caption" color="text.secondary">
                        {userInfo.email}
                      </Typography>
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      handleSignOut();
                    }}
                  >
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            )}
          </>
        ) : (
          <>
            {isAuthenticated && (
              <>
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                  }}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 1,
                    cursor: "pointer",
                    py: 0.5,
                    px: 1,
                    borderRadius: "0.5rem",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {userInfo?.picture ? (
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                      }}
                      src={userInfo.picture}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: theme.palette.primary.main,
                      }}
                    />
                  )}
                  <ChevronRightIcon
                    sx={{
                      fontSize: "1.25rem",
                      color: "text.secondary",
                      ml: 0.5,
                    }}
                  />
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      bgcolor: "background.paper",
                      border: 1,
                      borderColor: "divider",
                      boxShadow: 2,
                    },
                  }}
                >
                  {userInfo?.name && (
                    <MenuItem disabled>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {userInfo.name}
                      </Typography>
                    </MenuItem>
                  )}
                  {userInfo?.email && (
                    <MenuItem disabled>
                      <Typography variant="caption" color="text.secondary">
                        {userInfo.email}
                      </Typography>
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      handleSignOut();
                    }}
                  >
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            )}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <IconButton
                onClick={toggleThemeMode}
                sx={{
                  width: 40,
                  height: 40,
                  color: "text.primary",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
