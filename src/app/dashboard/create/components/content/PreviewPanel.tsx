"use client";

import { Box, Typography } from "@mui/material";
import { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import {
  CreateJourneyFormData,
  ReactNativeJson,
} from "../../types/journeyTypes";
import { previewPanelStyles } from "../../styles/previewPanelStyles";
import { useMemo } from "react";
import DeviceFrame from "./DeviceFrame";

interface PreviewPanelProps {
  control: Control<CreateJourneyFormData>;
}

export default function PreviewPanel({ control }: PreviewPanelProps) {
  const template = useWatch({
    control,
    name: "nudgeSelection.actions.0.template",
  }) as ReactNativeJson | undefined;

  // Extract children from template
  const children = useMemo(() => {
    return template?.children || [];
  }, [template]);

  // Simple recursive render - only use template data, no extra styles
  const renderNode = (
    node: ReactNativeJson,
    key: string | number
  ): React.ReactNode => {
    if (!node) return null;

    const { type, props = {}, styles = {}, children: nodeChildren } = node;
    const nodeProps = props as Record<string, any>;

    // Convert styles to CSS (only what's in template)
    const cssStyles: Record<string, string | number> = {};
    if (styles) {
      Object.entries(styles).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Convert camelCase to kebab-case for CSS
          const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
          cssStyles[cssKey] =
            typeof value === "number" ? `${value}px` : String(value);
        }
      });
    }

    // Extract text content from title prop
    const getTextContent = (): string => {
      if (typeof nodeProps.title === "string") {
        return nodeProps.title;
      }
      if (Array.isArray(nodeProps.title) && nodeProps.title[0]?.value) {
        return String(nodeProps.title[0].value);
      }
      return "";
    };

    // Render based on type - only template styles, no extras
    if (type === "Text") {
      const textContent = getTextContent();
      const fontWeight =
        nodeProps.fontWeight === "bold"
          ? "bold"
          : nodeProps.fontWeight === "medium"
          ? "500"
          : undefined;

      // If textAlign is center, ensure the element can take full width
      const textAlign = styles.textAlign;
      const textStyles = {
        ...cssStyles,
        ...(fontWeight ? { fontWeight } : {}),
        // If textAlign is center and element is in a flex container, make it block-level
        ...(textAlign === "center" ? { display: "block", width: "100%" } : {}),
      };

      return (
        <span key={key} style={textStyles}>
          {textContent}
        </span>
      );
    }

    if (type === "Image") {
      const src = nodeProps.uri || nodeProps.src || nodeProps.source;
      if (!src) return null;

      return <img key={key} src={String(src)} alt="" style={cssStyles} />;
    }

    if (type === "Button") {
      const textContent = getTextContent();
      const fontWeight =
        nodeProps.fontWeight === "bold"
          ? "bold"
          : nodeProps.fontWeight === "medium"
          ? "500"
          : undefined;

      return (
        <button
          key={key}
          disabled
          style={{
            ...cssStyles,
            ...(fontWeight ? { fontWeight } : {}),
            border: "none",
            cursor: "default",
          }}
        >
          {textContent}
        </button>
      );
    }

    if (type === "View") {
      // Only add display: flex if flex properties are present
      const hasFlexProps =
        styles.flexDirection ||
        styles.flex ||
        styles.flexGrow ||
        styles.flexShrink ||
        styles.flexBasis ||
        styles.justifyContent ||
        styles.alignItems;

      const viewStyles = hasFlexProps
        ? { display: "flex", ...cssStyles }
        : cssStyles;

      return (
        <div key={key} style={viewStyles}>
          {nodeChildren && Array.isArray(nodeChildren)
            ? nodeChildren.map((child, idx) =>
                renderNode(child, `${key}-${idx}`)
              )
            : null}
        </div>
      );
    }

    return null;
  };

  return (
    <Box sx={previewPanelStyles.container}>
      <Typography sx={previewPanelStyles.title}>Preview</Typography>
      <DeviceFrame device="iphone" width={360}>
        {/* Bottom sheet container - minimal styling */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {/* Bottom sheet content - only template styles */}
          <Box
            sx={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              width: "100%",
            }}
          >
            {children && children.length > 0
              ? children.map((element: ReactNativeJson, index: number) =>
                  renderNode(element, index)
                )
              : null}
          </Box>
        </Box>
      </DeviceFrame>
    </Box>
  );
}
