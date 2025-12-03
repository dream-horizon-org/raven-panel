"use client";

import { Box, Typography } from "@mui/material";
import { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import {
  CreateJourneyFormData,
  ReactNativeJson,
  NudgeType,
} from "../../types/journeyTypes";
import { previewPanelStyles } from "../../styles/previewPanelStyles";
import { useMemo, useEffect } from "react";
import DeviceFrame from "./DeviceFrame";
import { useElementLocator } from "../../contexts/ElementLocatorContext";

interface PreviewPanelProps {
  control: Control<CreateJourneyFormData>;
}

export default function PreviewPanel({ control }: PreviewPanelProps) {
  const { selectedTestID, setSelectedTestID } = useElementLocator();
  const template = useWatch({
    control,
    name: "nudgeSelection.actions.0.template",
  }) as ReactNativeJson | undefined;

  const actions = useWatch({
    control,
    name: "nudgeSelection.actions",
  });

  const engagementType = actions?.[0]?.type;

  // Auto-dismiss highlight after 3 seconds
  useEffect(() => {
    if (selectedTestID) {
      const timer = setTimeout(() => {
        setSelectedTestID(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [selectedTestID, setSelectedTestID]);

  // Extract children from template
  const children = useMemo(() => {
    return template?.children || [];
  }, [template]);

  // Simple recursive render - only use template data, no extra styles
  const renderNode = (
    node: ReactNativeJson,
    key: string | number,
    isBottomSheetRoot: boolean = false
  ): React.ReactNode => {
    if (!node) return null;

    const { type, props = {}, styles = {}, children: nodeChildren } = node;
    const nodeProps = props as Record<string, any>;
    const nodeTestID = nodeProps.testID as string | undefined;
    const isHighlighted = nodeTestID && selectedTestID === nodeTestID;

    // Use engagementType from action, fallback to template.type if not available
    let nudgeTypeForNode: string | NudgeType | undefined = engagementType;
    if (!nudgeTypeForNode && template?.type) {
      const templateType = template.type.toString().toUpperCase();
      if (templateType === "BOTTOMSHEET") {
        nudgeTypeForNode = NudgeType.NUDGE_UI;
      } else {
        nudgeTypeForNode = templateType;
      }
    }
    const nudgeTypeStr = nudgeTypeForNode?.toString().toUpperCase() || "";
    const isBottomSheet =
      nudgeTypeStr === "NUDGE_UI" ||
      nudgeTypeForNode === NudgeType.NUDGE_UI ||
      nudgeTypeStr === "BOTTOMSHEET";

    // Convert styles to CSS (only what's in template)
    const cssStyles: Record<string, string | number> = {};
    if (styles) {
      Object.entries(styles).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          const cssKey = k.replace(/([A-Z])/g, "-$1").toLowerCase();

          if (
            isBottomSheet &&
            isBottomSheetRoot &&
            k === "borderRadius" &&
            typeof v === "number"
          ) {
            cssStyles["border-top-left-radius"] = `${v}px`;
            cssStyles["border-top-right-radius"] = `${v}px`;
            cssStyles["border-bottom-left-radius"] = "0px";
            cssStyles["border-bottom-right-radius"] = "0px";
          } else {
            cssStyles[cssKey] = typeof v === "number" ? `${v}px` : String(v);
          }
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
        ...(isHighlighted
          ? {
              outline: "1px dashed #F44336",
              outlineOffset: "1px",
            }
          : {
              // Explicitly remove outline when not highlighted to prevent style persistence
              outline: "none",
            }),
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
            ...(isHighlighted
              ? {
                  outline: "1px dashed #F44336",
                  outlineOffset: "1px",
                }
              : {
                  // Explicitly remove outline when not highlighted to prevent style persistence
                  outline: "none",
                }),
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
            ...(isHighlighted
              ? {
                  outline: "1px dashed #F44336",
                  outlineOffset: "1px",
                }
              : {
                  // Explicitly remove outline when not highlighted to prevent style persistence
                  outline: "none",
                }),
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
            ...(isHighlighted && {
              outline: "3px solid #4F46E5",
              outlineOffset: "2px",
              boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.2)",
            }),
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
        ...(isHighlighted
          ? {
              outline: "1px dashed #F44336",
              outlineOffset: "1px",
            }
          : {
              // Explicitly remove outline when not highlighted to prevent style persistence
              outline: "none",
            }),
      } as React.CSSProperties;

      return (
        <div key={key} style={viewStyles}>
          {nodeChildren && Array.isArray(nodeChildren)
            ? nodeChildren.map(
                (child, idx) => renderNode(child, `${key}-${idx}`, false) // Children are not root
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
    // Use engagementType from action first, then fallback to template.type
    // This ensures correct rendering even when template.type is "BottomSheet" instead of "NUDGE_UI"
    let nudgeType: string | NudgeType | undefined = engagementType;

    if (!nudgeType && template?.type) {
      const templateType = template.type.toString().toUpperCase();
      // Map template type strings to NudgeType enum values
      if (templateType === "BOTTOMSHEET") {
        nudgeType = NudgeType.NUDGE_UI;
      } else if (templateType === "POPUP") {
        nudgeType = NudgeType.POPUP;
      } else if (templateType === "TOOLTIP") {
        nudgeType = NudgeType.TOOLTIP;
      } else {
        nudgeType = templateType;
      }
    }

    // Convert to string for comparison
    const nudgeTypeStr = nudgeType?.toString().toUpperCase() || "";

    // ...inside renderStage() -> POPUP branch
    if (nudgeTypeStr === "POPUP" || nudgeType === NudgeType.POPUP) {
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
            {children.map((el, i) => renderNode(el, i, false))}
          </Box>
        </Box>
      );
    }

    // NUDGE_UI (BottomSheet): full-screen dim + content anchored to bottom
    if (
      nudgeTypeStr === "NUDGE_UI" ||
      nudgeType === NudgeType.NUDGE_UI ||
      nudgeTypeStr === "BOTTOMSHEET"
    ) {
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
            {children.map(
              (element: ReactNativeJson, index: number) =>
                renderNode(element, index, index === 0) // First child is the root container
            )}
          </Box>
        </Box>
      );
    }

    // TOOLTIP: render directly from props and styles without nested elements
    if (nudgeTypeStr === "TOOLTIP" || nudgeType === NudgeType.TOOLTIP) {
      if (!template) return null;

      const tooltipProps = (template.props || {}) as Record<string, any>;
      const tooltipStyles = template.styles || {};

      // Only render tooltip if a template variant is selected (has templateVariantId)
      const hasTemplateVariant = tooltipProps.templateVariantId;
      if (!hasTemplateVariant) return null;

      const tooltipTestID = tooltipProps.testID as string | undefined;
      const isTooltipHighlighted =
        tooltipTestID && selectedTestID === tooltipTestID;

      // Convert styles to CSS
      const cssStyles: Record<string, string | number> = {};
      Object.entries(tooltipStyles).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          const cssKey = k.replace(/([A-Z])/g, "-$1").toLowerCase();
          cssStyles[cssKey] = typeof v === "number" ? `${v}px` : String(v);
        }
      });

      // Extract title and subtitle
      const title =
        typeof tooltipProps.title === "string"
          ? tooltipProps.title
          : Array.isArray(tooltipProps.title) && tooltipProps.title[0]?.value
          ? String(tooltipProps.title[0].value)
          : "";

      const subTitle =
        typeof tooltipProps.subTitle === "string"
          ? tooltipProps.subTitle
          : Array.isArray(tooltipProps.subTitle) &&
            tooltipProps.subTitle[0]?.value
          ? String(tooltipProps.subTitle[0].value)
          : "";

      // Apply text styles from props
      const titleStyle: React.CSSProperties = {
        fontSize: tooltipProps.titleFontSize
          ? `${tooltipProps.titleFontSize}px`
          : undefined,
        color: tooltipProps.titleColor || undefined,
        fontFamily: tooltipProps.titleFontFamily || undefined,
        fontWeight: tooltipProps.titleFontWeight || undefined,
        textAlign:
          tooltipProps.titleAlignment === "left"
            ? "left"
            : tooltipProps.titleAlignment === "center"
            ? "center"
            : tooltipProps.titleAlignment === "right"
            ? "right"
            : undefined,
      };

      const subTitleStyle: React.CSSProperties = {
        fontSize: tooltipProps.subTitleFontSize
          ? `${tooltipProps.subTitleFontSize}px`
          : undefined,
        color: tooltipProps.subTitleColor || undefined,
        fontFamily: tooltipProps.subTitleFontFamily || undefined,
        fontWeight: tooltipProps.subTitleFontWeight || undefined,
        textAlign:
          tooltipProps.subTitleAlignment === "left"
            ? "left"
            : tooltipProps.subTitleAlignment === "center"
            ? "center"
            : tooltipProps.subTitleAlignment === "right"
            ? "right"
            : undefined,
        marginTop: subTitle ? "4px" : undefined,
      };

      // Get arrow size and position
      const arrowSize = tooltipProps.arrowSize || 16;
      const position = tooltipProps.position || "top";
      const backgroundColor = tooltipStyles.backgroundColor || "#0096C7";

      // Calculate tooltip container position based on position prop
      const getTooltipContainerStyles = () => {
        switch (position) {
          case "top":
            return {
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: "20%",
            };
          case "bottom":
            return {
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: "20%",
            };
          case "left":
            return {
              alignItems: "center",
              justifyContent: "flex-start",
              paddingLeft: "10%",
            };
          case "right":
            return {
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: "10%",
            };
          default:
            return {
              alignItems: "center",
              justifyContent: "center",
            };
        }
      };

      // Calculate arrow position styles
      const getArrowStyles = () => {
        const arrowSizePx = `${arrowSize}px`;
        const baseArrowStyle: React.CSSProperties = {
          position: "absolute",
          width: 0,
          height: 0,
        };

        switch (position) {
          case "top":
            return {
              ...baseArrowStyle,
              bottom: `calc(-${arrowSizePx} + 1px)`,
              left: `${arrowSize}px`,
              borderLeft: `${arrowSizePx} solid transparent`,
              borderRight: `${arrowSizePx} solid transparent`,
              borderTop: `${arrowSizePx} solid ${backgroundColor}`,
            };
          case "bottom":
            return {
              ...baseArrowStyle,
              top: `calc(-${arrowSizePx} + 1px)`,
              left: `${arrowSize}px`,
              borderLeft: `${arrowSizePx} solid transparent`,
              borderRight: `${arrowSizePx} solid transparent`,
              borderBottom: `${arrowSizePx} solid ${backgroundColor}`,
            };
          case "left":
            return {
              ...baseArrowStyle,
              right: `-${arrowSizePx}`,
              top: "50%",
              transform: "translateY(-50%)",
              borderTop: `${arrowSizePx} solid transparent`,
              borderBottom: `${arrowSizePx} solid transparent`,
              borderLeft: `${arrowSizePx} solid ${backgroundColor}`,
            };
          case "right":
            return {
              ...baseArrowStyle,
              left: `-${arrowSizePx}`,
              top: "50%",
              transform: "translateY(-50%)",
              borderTop: `${arrowSizePx} solid transparent`,
              borderBottom: `${arrowSizePx} solid transparent`,
              borderRight: `${arrowSizePx} solid ${backgroundColor}`,
            };
          default:
            return {
              ...baseArrowStyle,
              bottom: `calc(-${arrowSizePx} + 1px)`,
              left: `${arrowSize}px`,
              borderLeft: `${arrowSizePx} solid transparent`,
              borderRight: `${arrowSizePx} solid transparent`,
              borderTop: `${arrowSizePx} solid ${backgroundColor}`,
            };
        }
      };

      return (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            ...getTooltipContainerStyles(),
            pointerEvents: "none",
            bgcolor: "rgba(0,0,0,0.45)",
          }}
        >
          <Box
            sx={{
              ...cssStyles,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "visible",
              ...(isTooltipHighlighted
                ? {
                    outline: "1px dashed #F44336",
                    outlineOffset: "1px",
                  }
                : {
                    // Explicitly remove outline when not highlighted to prevent style persistence
                    outline: "none",
                  }),
            }}
          >
            {title && (
              <Typography
                component="div"
                sx={{
                  ...titleStyle,
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
            )}
            {subTitle && (
              <Typography
                component="div"
                sx={{
                  ...subTitleStyle,
                  lineHeight: 1.2,
                }}
              >
                {subTitle}
              </Typography>
            )}
            {/* Arrow indicator */}
            {arrowSize > 0 && (
              <Box
                sx={{
                  ...getArrowStyles(),
                }}
              />
            )}
          </Box>
        </Box>
      );
    }

    // Unknown type: just center in screen without dim
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
          renderNode(element, index, false)
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
