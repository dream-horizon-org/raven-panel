"use client";

import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  SvgIconProps,
} from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CampaignIcon from "@mui/icons-material/Campaign";
import WidgetsIcon from "@mui/icons-material/Widgets";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FlagIcon from "@mui/icons-material/Flag";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import HeadsetIcon from "@mui/icons-material/Headset";
import StorageIcon from "@mui/icons-material/Storage";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import {
  sidebarStyles,
  sidebarLogoContainerStyles,
  sidebarLogoStyles,
  sidebarLogoInnerStyles,
  sidebarNavStyles,
  sidebarNavItemStyles,
  sidebarNavItemActiveStyles,
  sidebarNavItemInactiveStyles,
  sidebarNavIconStyles,
  sidebarNavTextStyles,
  sidebarNavTextActiveStyles,
  sidebarBottomContainerStyles,
  sidebarCollapseButtonStyles,
} from "./styles/sidebarStyles";
import { useThemeMode } from "@/app/providers/ThemeModeProvider";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  label: string;
  icon: React.ComponentType<SvgIconProps>;
  path?: string;
}

export default function Sidebar() {
  const { mode, toggleThemeMode } = useThemeMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

      <Box sx={sidebarBottomContainerStyles(isCollapsed)}>
        {!isCollapsed && (
          <IconButton
            onClick={toggleThemeMode}
            sx={sidebarNavItemInactiveStyles(isCollapsed)}
          >
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            {!isCollapsed && (
              <Typography sx={{ ml: 1.5, fontSize: "0.875rem" }}>
                {mode === "light" ? "Dark Mode" : "Light Mode"}
              </Typography>
            )}
          </IconButton>
        )}
        {isCollapsed && (
          <IconButton
            onClick={() => setIsCollapsed(false)}
            sx={sidebarCollapseButtonStyles}
            title="Expand sidebar"
          >
            <ChevronLeftIcon sx={{ transform: "rotate(180deg)" }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
