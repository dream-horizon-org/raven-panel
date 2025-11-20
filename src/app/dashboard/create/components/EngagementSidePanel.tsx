"use client";

import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Control, FieldErrors, useWatch } from "react-hook-form";
import { CreateJourneyFormData } from "../types/journeyTypes";
import { useState } from "react";
import TemplateTab from "./content/TemplateTab";
import ContentTab from "./content/ContentTab";
import PreviewPanel from "./content/PreviewPanel";
import { engagementSidePanelStyles } from "../styles/engagementSidePanelStyles";

interface EngagementSidePanelProps {
  open: boolean;
  onClose: () => void;
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
}

export default function EngagementSidePanel({
  open,
  onClose,
  control,
  errors,
}: EngagementSidePanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"template" | "content">(
    "template"
  );

  const actions = useWatch({
    control,
    name: "nudgeSelection.actions",
  });
  const engagementType = actions?.[0]?.type;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: engagementSidePanelStyles.drawerPaper,
      }}
    >
      <Box sx={engagementSidePanelStyles.container}>
        <Box sx={engagementSidePanelStyles.header}>
          <Typography sx={engagementSidePanelStyles.title}>
            Configure Engagement:{" "}
            {engagementType ? String(engagementType) : "Select Type"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={engagementSidePanelStyles.content}>
          <Box sx={engagementSidePanelStyles.previewSection}>
            <PreviewPanel control={control} />
          </Box>

          <Box sx={engagementSidePanelStyles.configSection}>
            <Tabs
              value={activeSubTab}
              onChange={(_, newValue) => setActiveSubTab(newValue)}
              sx={engagementSidePanelStyles.tabs}
            >
              <Tab value="template" label="Template" />
              <Tab value="content" label="Content" />
            </Tabs>

            <Box sx={engagementSidePanelStyles.tabContent}>
              {activeSubTab === "template" && (
                <TemplateTab control={control} errors={errors} />
              )}
              {activeSubTab === "content" && (
                <ContentTab control={control} errors={errors} />
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={engagementSidePanelStyles.footer}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onClose}>
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
