"use client";

import { Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TuneIcon from "@mui/icons-material/Tune";
import { useTheme } from "@mui/material/styles";
import { journeyTabsStyles } from "../styles/journeyTabsStyles";
import { JOURNEY_TEXT } from "../constants/journeyConstants";

interface JourneyTabsProps {
  activeTab: "setup" | "ui";
  onTabChange: (tab: "setup" | "ui") => void;
}

export default function JourneyTabs({
  activeTab,
  onTabChange,
}: JourneyTabsProps) {
  const theme = useTheme();

  return (
    <Box sx={journeyTabsStyles.tabsContainer}>
      <Box
        sx={journeyTabsStyles.customTab(activeTab === "setup", theme)}
        onClick={() => onTabChange("setup")}
      >
        <PersonIcon sx={journeyTabsStyles.tabIcon(activeTab === "setup")} />
        <Typography sx={journeyTabsStyles.tabText(activeTab === "setup")}>
          {JOURNEY_TEXT.TABS.SETUP}
        </Typography>
        {activeTab === "setup" && (
          <ArrowForwardIosIcon sx={journeyTabsStyles.tabArrow} />
        )}
      </Box>
      <Box
        sx={journeyTabsStyles.customTab(activeTab === "ui", theme)}
        onClick={() => onTabChange("ui")}
      >
        <TuneIcon sx={journeyTabsStyles.tabIcon(activeTab === "ui")} />
        <Typography sx={journeyTabsStyles.tabText(activeTab === "ui")}>
          {JOURNEY_TEXT.TABS.UI_CONTENT}
        </Typography>
      </Box>
    </Box>
  );
}
