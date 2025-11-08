"use client";

import { useState, useCallback, useMemo } from "react";
import { Node } from "@xyflow/react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { EngagementNodeData, Engagement, EngagementConfig, UIElement } from "./types";
import EngagementVariantSelector from "./engagement/EngagementVariantSelector";
import EngagementContentEditor from "./engagement/EngagementContentEditor";
import EngagementPreview from "./engagement/EngagementPreview";

interface EngagementConfigurationPanelProps {
  engagementNode: Node<EngagementNodeData>;
  sourceNode: Node; // The state node that has this engagement
  onUpdate: (engagementId: string, config: EngagementConfig) => void;
  onClose: () => void;
}

export default function EngagementConfigurationPanel({
  engagementNode,
  sourceNode,
  onUpdate,
  onClose,
}: EngagementConfigurationPanelProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [localConfig, setLocalConfig] = useState<EngagementConfig>(() => {
    // Get engagement from source node
    const engagement = (sourceNode.data as any).engagements?.find(
      (e: Engagement) => e.id === engagementNode.data.engagementId
    );
    return (engagement?.config as EngagementConfig) || { content: { elements: [] } };
  });

  const handleSave = useCallback(() => {
    onUpdate(engagementNode.data.engagementId, localConfig);
    onClose();
  }, [engagementNode.data.engagementId, localConfig, onUpdate, onClose]);

  const handleConfigChange = useCallback((updates: Partial<EngagementConfig>) => {
    setLocalConfig((prev) => ({
      ...prev,
      ...updates,
      content: {
        ...prev.content,
        ...updates.content,
      },
    }));
  }, []);

  const handleVariantSelect = useCallback((variantId: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      variant: variantId,
    }));
  }, []);

  const handleContentChange = useCallback((elements: UIElement[]) => {
    setLocalConfig((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        elements,
      },
    }));
  }, []);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Configure Engagement</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ flex: 1, display: "flex", gap: 3, overflow: "hidden" }}>
        {/* Mobile Preview - Left Side (Fixed Width) */}
        <Box
          sx={{
            width: "380px",
            minWidth: "380px",
            display: "flex",
            flexDirection: "column",
            bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
            borderRadius: 2,
            p: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
            Preview
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
            <EngagementPreview
              engagementType={engagementNode.data.engagementType}
              config={localConfig}
            />
          </Box>
        </Box>

        {/* Configuration Panel - Right Side (Takes Remaining Space) */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              mb: 3,
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                minHeight: 48,
              },
            }}
          >
            <Tab label="Template" />
            <Tab label="Content" />
          </Tabs>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                bgcolor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "grey.400",
                borderRadius: "4px",
                "&:hover": {
                  bgcolor: "grey.500",
                },
              },
            }}
          >
            {activeTab === 0 && (
              <EngagementVariantSelector
                engagementType={engagementNode.data.engagementType}
                selectedVariant={localConfig.variant}
                onSelectVariant={handleVariantSelect}
              />
            )}

            {activeTab === 1 && (
              <EngagementContentEditor
                elements={localConfig.content?.elements || []}
                onElementsChange={handleContentChange}
              />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={onClose} sx={{ minWidth: 100 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} sx={{ minWidth: 100 }}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

