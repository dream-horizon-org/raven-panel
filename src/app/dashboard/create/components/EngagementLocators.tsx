import { ElementLocatorProvider } from "../contexts/ElementLocatorContext";
import PreviewPanel from "./content/PreviewPanel";
import { Tab, Tabs, Box, Button, Badge } from "@mui/material";
import { engagementSidePanelStyles } from "./content/styles/engagementSidePanelStyles";
import { Control, FieldErrors, useWatch } from "react-hook-form";
import { CreateJourneyFormData, NudgeType } from "../types/journey.interface";
import ErrorIcon from "@mui/icons-material/Error";
import ContentTab from "./content/ContentTab";
import LocationTab from "./content/LocationTab";
import TemplateTab from "./content/TemplateTab";
import NativeEventEmitterEditor from "./content/NativeEventEmitterEditor";
import { Dispatch, SetStateAction, useMemo } from "react";
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
  const actions = useWatch({
    control,
    name: "nudgeSelection.actions",
  });

  const actionIndex = useMemo(() => {
    if (!engagementId) return 0;
    // Find action index by engagementId (assuming engagementId matches actionId prefix)
    const index = actions?.findIndex((action) => {
      const actionIdPrefix = action.actionId.includes("_")
        ? action.actionId.split("_")[0]
        : action.actionId;
      return actionIdPrefix === engagementId;
    });
    return index >= 0 ? index : 0;
  }, [engagementId, actions]);

  const engagementType = actions?.[actionIndex]?.type;
  const isNativeEventEmitter = engagementType === NudgeType.NUDGE_ACTION;

  return (
    <ElementLocatorProvider>
      <Box sx={engagementSidePanelStyles.content}>
        {!isNativeEventEmitter && (
          <Box sx={engagementSidePanelStyles.previewSection}>
            <PreviewPanel control={control} engagementId={engagementId} />
          </Box>
        )}
        <Box sx={engagementSidePanelStyles.configSection}>
          {!isNativeEventEmitter && (
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
          )}

          <Box sx={engagementSidePanelStyles.tabContent}>
            {isNativeEventEmitter ? (
              <NativeEventEmitterEditor actionIndex={actionIndex} />
            ) : (
              <>
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
              </>
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
