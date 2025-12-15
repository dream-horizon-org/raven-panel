"use client";

import { Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TuneIcon from "@mui/icons-material/Tune";
import ErrorIcon from "@mui/icons-material/Error";
import { useTheme } from "@mui/material/styles";
import { journeyTabsStyles } from "./content/styles/journeyTabsStyles";
import { JOURNEY_TEXT } from "../constants/journeyConstants";

interface JourneyTabsProps {
  activeTab: "setup" | "ui";
  onTabChange: (tab: "setup" | "ui") => void;
  hasTemplateError?: boolean;
}

export default function JourneyTabs({
  activeTab,
  onTabChange,
  hasTemplateError = false,
}: JourneyTabsProps) {
  const theme = useTheme();

  return (
    <Box sx={journeyTabsStyles.tabsContainer}>
      <Box
        sx={journeyTabsStyles.customTab(activeTab === "ui", theme)}
        onClick={() => onTabChange("ui")}
      >
        <TuneIcon sx={journeyTabsStyles.tabIcon()} />
        <Typography
          sx={{
            ...journeyTabsStyles.tabText(activeTab === "ui"),
            color: hasTemplateError ? "error.main" : undefined,
            fontWeight: hasTemplateError ? 600 : undefined,
          }}
        >
          {JOURNEY_TEXT.TABS.UI_CONTENT}
        </Typography>
        {hasTemplateError && (
          <ErrorIcon
            sx={{
              fontSize: "1.2rem",
              color: "error.main",
              ml: 0.5,
            }}
          />
        )}
        {activeTab === "ui" && (
          <ArrowForwardIosIcon sx={journeyTabsStyles.tabArrow} />
        )}
      </Box>
      <Box
        sx={journeyTabsStyles.customTab(activeTab === "setup", theme)}
        onClick={() => onTabChange("setup")}
      >
        <PersonIcon sx={journeyTabsStyles.tabIcon()} />
        <Typography sx={journeyTabsStyles.tabText(activeTab === "setup")}>
          {JOURNEY_TEXT.TABS.SETUP}
        </Typography>
      </Box>
    </Box>
  );
}
