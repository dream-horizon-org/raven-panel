"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { EngagementConfig, UIElement } from "../../types";

interface EngagementPreviewProps {
  engagementType: "tooltip" | "popup" | "bottomsheet";
  config: EngagementConfig;
}

export default function EngagementPreview({ engagementType: _engagementType, config }: EngagementPreviewProps) {
  const theme = useTheme();
  const elements = config.content?.elements || [];

  const renderElement = (element: UIElement): React.ReactNode => {
    switch (element.type) {
      case "text":
        const textEl = element as any;
        return (
          <Typography
            sx={{
              fontSize: `${textEl.fontSize || 16}px`,
              color: textEl.textColor || "#000000",
              textAlign: textEl.textAlignment || "left",
              margin: `${textEl.spacing?.margin?.top || 0}px ${textEl.spacing?.margin?.right || 0}px ${textEl.spacing?.margin?.bottom || 0}px ${textEl.spacing?.margin?.left || 0}px`,
              padding: `${textEl.spacing?.padding?.top || 0}px ${textEl.spacing?.padding?.right || 0}px ${textEl.spacing?.padding?.bottom || 0}px ${textEl.spacing?.padding?.left || 0}px`,
            }}
          >
            {textEl.text || "Text content"}
          </Typography>
        );
      case "image":
        const imageEl = element as any;
        return (
          <Box
            sx={{
              width: imageEl.occupyFullWidth ? "100%" : "auto",
              margin: `${imageEl.spacing?.margin?.top || 0}px ${imageEl.spacing?.margin?.right || 0}px ${imageEl.spacing?.margin?.bottom || 0}px ${imageEl.spacing?.margin?.left || 0}px`,
              padding: `${imageEl.spacing?.padding?.top || 0}px ${imageEl.spacing?.padding?.right || 0}px ${imageEl.spacing?.padding?.bottom || 0}px ${imageEl.spacing?.padding?.left || 0}px`,
            }}
          >
            {imageEl.imageSource ? (
              <img
                src={imageEl.imageSource}
                alt="Engagement"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "150px",
                  bgcolor: "grey.300",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  No image
                </Typography>
              </Box>
            )}
          </Box>
        );
      case "view":
        const viewEl = element as any;
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: viewEl.orientation === "horizontal" ? "row" : "column",
              gap: 1,
              margin: `${viewEl.spacing?.margin?.top || 0}px ${viewEl.spacing?.margin?.right || 0}px ${viewEl.spacing?.margin?.bottom || 0}px ${viewEl.spacing?.margin?.left || 0}px`,
              padding: `${viewEl.spacing?.padding?.top || 0}px ${viewEl.spacing?.padding?.right || 0}px ${viewEl.spacing?.padding?.bottom || 0}px ${viewEl.spacing?.padding?.left || 0}px`,
            }}
          >
            {viewEl.children?.map((child: UIElement) => renderElement(child))}
          </Box>
        );
      default:
        return null;
    }
  };

  const phoneFrameColor = theme.palette.mode === "dark" ? "#2a2a2a" : "#1a1a1a";
  const screenBgColor = theme.palette.mode === "dark" ? "#000000" : "#000000";
  const borderColor = theme.palette.mode === "dark" 
    ? "rgba(255, 255, 255, 0.15)" 
    : "rgba(255, 255, 255, 0.1)";
  const innerBorderColor = theme.palette.mode === "dark"
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(255, 255, 255, 0.08)";

  return (
    <Box
      sx={{
        width: "280px",
        height: "560px",
        bgcolor: phoneFrameColor,
        borderRadius: "32px",
        padding: "8px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: theme.palette.mode === "dark"
          ? "0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.15)"
          : "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
        border: `2px solid ${borderColor}`,
      }}
    >
      {/* Phone frame bezel */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "30px",
          border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)"}`,
          pointerEvents: "none",
        }}
      />

      {/* Screen content */}
      <Box
        sx={{
          flex: 1,
          bgcolor: screenBgColor,
          borderRadius: "24px",
          overflow: "hidden",
          position: "relative",
          mt: "8px",
          border: `1px solid ${innerBorderColor}`,
        }}
      >

        {/* Engagement content area */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "white",
            borderRadius: "20px 20px 0 0",
            p: 2,
            minHeight: "200px",
            maxHeight: "75%",
            overflowY: "auto",
            boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {elements.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "text.secondary",
              }}
            >
              <Typography variant="caption">No content elements</Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {elements.map((element) => (
                <Box key={element.id}>{renderElement(element)}</Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

