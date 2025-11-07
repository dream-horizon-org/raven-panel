"use client";

import { Box, Typography } from "@mui/material";
import { EngagementConfig, UIElement } from "../../types";

interface EngagementPreviewProps {
  engagementType: "tooltip" | "popup" | "bottomsheet";
  config: EngagementConfig;
}

export default function EngagementPreview({ engagementType, config }: EngagementPreviewProps) {
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

  return (
    <Box
      sx={{
        width: "240px",
        height: "420px",
        bgcolor: "grey.900",
        borderRadius: "20px",
        padding: "16px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: 6,
      }}
    >
      {/* Phone notch simulation */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100px",
          height: "16px",
          bgcolor: "grey.900",
          borderRadius: "0 0 10px 10px",
        }}
      />

      {/* Screen content */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "grey.800",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          mt: 1.5,
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
            borderRadius: "12px 12px 0 0",
            p: 1.5,
            minHeight: "180px",
            maxHeight: "75%",
            overflowY: "auto",
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

