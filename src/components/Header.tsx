"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { APP_NAME } from "@/config/constants";
import { useAuth } from "@/app/Auth/hooks/useAuth";
import { landingPageStyles } from "@/app/components/styles/landingPageStyles";
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

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { isAuthenticated, handleSignOut } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Hide header on login page
  if (pathname === "/login") {
    return null;
  }

  useEffect(() => {
    if (isAuthenticated) {
      setUserInfo(getUserInfo());
    } else {
      setUserInfo(null);
    }
  }, [isAuthenticated]);

  const handleSignIn = () => {
    router.push("/login");
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOutClick = () => {
    handleMenuClose();
    handleSignOut();
  };

  const userInitials = getUserInitials(userInfo);
  const isDashboard = pathname?.startsWith("/dashboard");

  // Use theme-aware styles for dashboard, landing page styles for landing
  const headerStyles = isDashboard
    ? {
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        position: "sticky" as const,
        top: 0,
        zIndex: 1000,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 2px 8px rgba(0, 0, 0, 0.5)"
            : "0px 2px 8px rgba(0, 0, 0, 0.1)",
      }
    : landingPageStyles.header(theme);

  const logoStyles = isDashboard
    ? {
        fontWeight: 700,
        color: "text.primary",
      }
    : landingPageStyles.logo(theme);

  const signInButtonStyles = isDashboard
    ? {
        textTransform: "none" as const,
        fontWeight: 600,
        px: 3,
      }
    : landingPageStyles.signInButton(theme);

  return (
    <Box component="header" sx={headerStyles}>
      <Container maxWidth="xl" sx={landingPageStyles.headerContainer}>
        <Typography variant="h5" sx={logoStyles}>
          {APP_NAME}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <Avatar
                onClick={handleAvatarClick}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1rem",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
                src={userInfo?.picture}
              >
                {userInitials}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
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
                <MenuItem onClick={handleSignOutClick}>Sign Out</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="outlined"
              onClick={handleSignIn}
              sx={signInButtonStyles}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
}
