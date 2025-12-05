"use client";

import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  actionMenuStyles,
  actionMenuItemStyles,
  actionMenuIconStyles,
} from "./styles/journeysTableStyles";
import { JOURNEY_MENU_ACTIONS } from "@/config/constants";
import { JourneyStatus } from "@/api/services/types/updateJourneyStatus.interface";
import { STATUS_TO_JOURNEY_STATUS_MAP } from "./DashboardConstants";

interface ActionMenuProps {
  anchorEl: HTMLElement | null;
  journeyId: number;
  hasEditAccess: boolean;
  hasPublishAccess: boolean;
  onClose: () => void;
  onCopyJourneyId: (journeyId: number) => void;
  onStatusChange: (journeyId: number, status: JourneyStatus) => void;
}

const getIconComponent = (iconName: string | undefined) => {
  if (!iconName) return null;
  switch (iconName) {
    case "FileCopyOutlined":
      return FileCopyOutlinedIcon;
    case "PlayCircleOutline":
      return PlayCircleOutlineIcon;
    case "Schedule":
      return ScheduleIcon;
    case "PauseCircleOutline":
      return PauseCircleOutlineIcon;
    case "StopCircle":
      return StopCircleIcon;
    case "CheckCircleOutline":
      return CheckCircleOutlineIcon;
    default:
      return null;
  }
};

export default function ActionMenu({
  anchorEl,
  journeyId,
  hasEditAccess,
  hasPublishAccess,
  onClose,
  onCopyJourneyId,
  onStatusChange,
}: ActionMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={actionMenuStyles}
    >
      {JOURNEY_MENU_ACTIONS.map((action) => {
        const IconComponent = getIconComponent(
          "icon" in action ? action.icon : undefined
        );

        const handleMenuItemClick = () => {
          if (action.hasAction) {
            if (action.id === "copy") {
              onCopyJourneyId(journeyId);
            }
          } else {
            const status = STATUS_TO_JOURNEY_STATUS_MAP[action.id];
            if (status) {
              onStatusChange(journeyId, status as JourneyStatus);
            }
          }
        };

        const requiresPublishAccess =
          action.id === "live" || action.id === "schedule";
        const requiresEditAccess = !action.hasAction && !requiresPublishAccess;
        const isDisabled =
          (requiresPublishAccess && !hasPublishAccess) ||
          (requiresEditAccess && !hasEditAccess);

        return (
          <MenuItem
            key={action.id}
            onClick={handleMenuItemClick}
            sx={actionMenuItemStyles}
            disabled={isDisabled}
          >
            {IconComponent && (
              <ListItemIcon sx={actionMenuIconStyles}>
                <IconComponent fontSize="small" />
              </ListItemIcon>
            )}
            <ListItemText primary={action.label} />
          </MenuItem>
        );
      })}
    </Menu>
  );
}
