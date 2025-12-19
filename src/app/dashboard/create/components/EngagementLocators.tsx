import { ElementLocatorProvider } from "../contexts/ElementLocatorContext";
import PreviewPanel from "./content/PreviewPanel";
import { Tab, Tabs, Box, Button, Badge } from "@mui/material";
import { engagementSidePanelStyles } from "./content/styles/engagementSidePanelStyles";
import { Control, FieldErrors } from "react-hook-form";
import { CreateJourneyFormData } from "../types/journey.interface";
import ErrorIcon from "@mui/icons-material/Error";
import ContentTab from "./content/ContentTab";
import LocationTab from "./content/LocationTab";
import TemplateTab from "./content/TemplateTab";
import { Dispatch, SetStateAction } from "react";
import { JOURNEY_TEXT } from "../constants/journeyConstants";

interface EngagementLocatorsProps {
  control: Control<CreateJourneyFormData>;
  engagementId: string | null | undefined;
  activeSubTab: string;
  setActiveSubTab: Dispatch<
    SetStateAction<"template" | "content" | "location">
  >;
  hasContentErrors: () => boolean;
  hasLocationErrors: () => boolean;
  isTooltip: boolean;
  errors: FieldErrors<CreateJourneyFormData>;
  handleCloseRequest: (closeAction: () => void) => void;
  handleSave: () => void;
  onClose: () => void;
}
export const EngagementLocators = ({
  control,
  engagementId,
  activeSubTab,
  setActiveSubTab,
  hasContentErrors,
  hasLocationErrors,
  isTooltip,
  errors,
  handleCloseRequest,
  handleSave,
  onClose,
}: EngagementLocatorsProps) => {
  return (
    <ElementLocatorProvider>
      <Box sx={engagementSidePanelStyles.content}>
        <Box sx={engagementSidePanelStyles.previewSection}>
          <PreviewPanel control={control} engagementId={engagementId} />
        </Box>
        <Box sx={engagementSidePanelStyles.configSection}>
          <Tabs
            value={activeSubTab}
            onChange={(_, newValue) => setActiveSubTab(newValue)}
            sx={engagementSidePanelStyles.tabs}
          >
            <Tab value="template" label="Template" />
            <Tab
              value="content"
              label={
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: hasContentErrors() ? "error.main" : "inherit",
                  }}
                >
                  {JOURNEY_TEXT.CONTENT}
                  {hasContentErrors() && (
                    <ErrorIcon
                      sx={{
                        fontSize: "1.2rem",
                        color: "error.main",
                      }}
                    />
                  )}
                </Box>
              }
            />
            {isTooltip && (
              <Tab
                value="location"
                label={
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={!hasLocationErrors()}
                    sx={{ "& .MuiBadge-badge": { right: -8, top: 8 } }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: hasLocationErrors() ? "error.main" : "inherit",
                      }}
                    >
                      {JOURNEY_TEXT.LOCATION}
                    </Box>
                  </Badge>
                }
              />
            )}
          </Tabs>

          <Box sx={engagementSidePanelStyles.tabContent}>
            {activeSubTab === "template" && (
              <TemplateTab
                control={control}
                errors={errors}
                engagementId={engagementId}
              />
            )}
            {activeSubTab === "content" && (
              <ContentTab
                control={control}
                errors={errors}
                engagementId={engagementId}
              />
            )}
            {activeSubTab === "location" && isTooltip && (
              <LocationTab
                control={control}
                errors={errors}
                engagementId={engagementId}
              />
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={engagementSidePanelStyles.footer}>
        <Button variant="outlined" onClick={() => handleCloseRequest(onClose)}>
          {JOURNEY_TEXT.ACTIONS.CANCEL}
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {JOURNEY_TEXT.SAVE}
        </Button>
      </Box>
    </ElementLocatorProvider>
  );
};
