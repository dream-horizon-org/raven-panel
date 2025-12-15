"use client";

import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { Control, FieldErrors } from "react-hook-form";
import { CreateJourneyFormData } from "../types/journey.interface";
import TemplateTab from "./content/TemplateTab";
import PreviewPanel from "./content/PreviewPanel";
import { contentEditorStyles } from "./content/styles/contentEditorStyles";
import ContentTab from "./content/ContentTab";

interface ContentEditorProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
}

export default function ContentEditor({ control, errors }: ContentEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<"template" | "content">(
    "template"
  );

  return (
    <Box sx={contentEditorStyles.container}>
      <Box sx={contentEditorStyles.previewSection}>
        <PreviewPanel control={control} />
      </Box>
      <Box sx={contentEditorStyles.configSection}>
        <Box sx={contentEditorStyles.tabsContainer}>
          <Tabs
            value={activeSubTab}
            onChange={(_, newValue) => setActiveSubTab(newValue)}
            sx={contentEditorStyles.tabs}
          >
            <Tab value="template" label="Template" />
            <Tab value="content" label="Content" />
          </Tabs>
        </Box>
        <Box sx={contentEditorStyles.tabContent}>
          {activeSubTab === "template" && (
            <TemplateTab control={control} errors={errors} />
          )}
          {activeSubTab === "content" && (
            <ContentTab control={control} errors={errors} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
