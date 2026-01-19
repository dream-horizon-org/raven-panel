"use client";

import Box from "@mui/material/Box";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import {
  contentContainerStyles,
  layoutContainerStyles,
  mainContainerStyles,
} from "./styles/dashboardLayoutStyles";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={layoutContainerStyles}>
      <Box sx={mainContainerStyles}>
        <Sidebar />
        <Box component="main" sx={contentContainerStyles}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
