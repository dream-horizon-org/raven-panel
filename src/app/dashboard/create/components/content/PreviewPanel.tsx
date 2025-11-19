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
      Object.entries(styles).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          const cssKey = k.replace(/([A-Z])/g, "-$1").toLowerCase();
          cssStyles[cssKey] = typeof v === "number" ? `${v}px` : String(v);
        }
      });
    }

    // Extract text content from title prop
    const getTextContent = (): string => {
      if (typeof nodeProps.title === "string") return nodeProps.title;
      if (Array.isArray(nodeProps.title) && nodeProps.title[0]?.value) {
        return String(nodeProps.title[0].value);
      }
      return "";
    };

    // Render based on type - only template styles, no extras
    if (type === "Text") {
      const textContent = getTextContent();

      const weight =
        nodeProps.fontWeight === "bold"
          ? "bold"
          : nodeProps.fontWeight === "medium"
          ? "500"
          : undefined;

      const ai = (styles as any)?.alignItems as
        | "center"
        | "flex-start"
        | "flex-end"
        | undefined;

      const mappedTextAlign =
        (styles as any)?.textAlign ??
        (ai === "center"
          ? "center"
          : ai === "flex-end"
          ? "right"
          : ai === "flex-start"
          ? "left"
          : undefined);

      const textStyles: React.CSSProperties = {
        ...cssStyles,
        ...(weight ? { fontWeight: weight } : {}),
        ...(mappedTextAlign
          ? {
              textAlign: mappedTextAlign,
              ...(cssStyles.width ? {} : { display: "block", width: "100%" }),
            }
          : {}),
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

      return (
        <img
          key={key}
          src={String(src)}
          alt=""
          style={{
            ...cssStyles,
            display: "block", // NEW: no inline baseline gap
            maxWidth: "100%", // safe guard
          }}
        />
      );
    }

    if (type === "Button") {
      const textContent = getTextContent();
      const weight =
        nodeProps.fontWeight === "bold"
          ? "bold"
          : nodeProps.fontWeight === "medium"
          ? "500"
          : undefined;

      const ai = (styles as any)?.alignItems as
        | "center"
        | "flex-start"
        | "flex-end"
        | undefined;

      const mappedTextAlign =
        (styles as any)?.textAlign ??
        (ai === "center"
          ? "center"
          : ai === "flex-end"
          ? "right"
          : ai === "flex-start"
          ? "left"
          : undefined);

      return (
        <button
          key={key}
          disabled
          style={{
            ...cssStyles,
            ...(weight ? { fontWeight: weight } : {}),
            ...(mappedTextAlign ? { textAlign: mappedTextAlign } : {}),
            border: "none",
            cursor: "default",
          }}
        >
          {textContent}
        </button>
      );
    }

    // inside renderNode()

    if (type === "Image") {
      const src = nodeProps.uri || nodeProps.src || nodeProps.source;
      if (!src) return null;

      return (
        <img
          key={key}
          src={String(src)}
          alt=""
          style={{
            ...cssStyles,
            display: "block", // NEW: no inline baseline gap
            maxWidth: "100%", // safe guard
          }}
        />
      );
    }

    if (type === "View") {
      const hasFlexProps =
        (styles as any).flexDirection ||
        (styles as any).flex ||
        (styles as any).flexGrow ||
        (styles as any).flexShrink ||
        (styles as any).flexBasis ||
        (styles as any).justifyContent ||
        (styles as any).alignItems;

      // NEW: detect any radius
      const hasRadius =
        (styles as any).borderRadius != null ||
        (styles as any).borderTopLeftRadius != null ||
        (styles as any).borderTopRightRadius != null ||
        (styles as any).borderBottomLeftRadius != null ||
        (styles as any).borderBottomRightRadius != null;

      const viewStyles = {
        ...(hasFlexProps ? { display: "flex" } : {}),
        ...cssStyles,
        ...(hasRadius
          ? {
              overflow: "hidden", // << keeps children (the ✖️) inside
              position: "relative", // stable stacking context
            }
          : {}),
      } as React.CSSProperties;

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
  // ----------------------------------------------------------

  // Simple helper to render the correct "stage" around the template
  const renderStage = () => {
    const nudgeType = (template?.type || "").toString().toUpperCase();

    // ...inside renderStage() -> POPUP branch
    if (nudgeType === "POPUP") {
      return (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {/* NEW: make % widths resolve against the device width */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {children.map((el, i) => renderNode(el, i))}
          </Box>
        </Box>
      );
    }

    // NUDGE_UI (BottomSheet): full-screen dim + content anchored to bottom
    if (nudgeType === "NUDGE_UI") {
      return (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pointerEvents: "none",
          }}
        >
          {/* Render the template as-is; it already defines a white panel etc. */}
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {children.map((element: ReactNativeJson, index: number) =>
              renderNode(element, index)
            )}
          </Box>
        </Box>
      );
    }

    // TOOLTIP or unknown: just center in screen without dim
    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {children.map((element: ReactNativeJson, index: number) =>
          renderNode(element, index)
        )}
      </Box>
    );
  };

  return (
    <Box sx={previewPanelStyles.container}>
      <Typography sx={previewPanelStyles.title}>Preview</Typography>

      <DeviceFrame device="iphone" width={360}>
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          {renderStage()}
        </Box>
      </DeviceFrame>
    </Box>
  );
}
