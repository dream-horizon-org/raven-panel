"use client";

import { Box, Typography, Card, CardContent, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Control, FieldErrors, useWatch } from "react-hook-form";
import { Controller, FieldValues } from "react-hook-form";
import {
  CreateJourneyFormData,
  NudgeType,
  ReactNativeJson,
} from "../../types/journeyTypes";
import { templateTabStyles } from "../../styles/templateTabStyles";

interface TemplateTabProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
}

// Template generator functions that create the ReactNativeJson structure
const generateTemplate = (
  type: NudgeType,
  variant: string
): ReactNativeJson => {
  const timestamp = Date.now();
  const baseTemplate = {
    type: type,
    props: {
      testID: `testID-${timestamp}`,
      templateVariantId: variant, // Store variant ID to identify selected template
    },
    actions: [],
    styles: {},
    children: [],
  };

  if (type === NudgeType.BOTTOMSHEET) {
    if (variant === "bottomsheet-cta") {
      // BottomSheet with CTA - more complex structure
      return {
        ...baseTemplate,
        children: [
          {
            type: "View",
            props: { testID: "testID-72" },
            actions: [],
            styles: {
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              width: "100%",
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 8,
              paddingBottom: 8,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            },
            children: [
              {
                type: "View",
                props: { testID: "testID-73" },
                actions: [],
                styles: {
                  width: "100%",
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 8,
                  paddingBottom: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                children: [
                  {
                    type: "Text",
                    props: {
                      title: [
                        {
                          value: "Allow Notifications",
                          isTemplateString: false,
                        },
                      ],
                      fontWeight: "bold",
                      testID: "testID-24",
                    },
                    actions: [],
                    styles: {
                      textAlign: "center",
                      color: "#111827",
                      fontSize: 18,
                    },
                  },
                  {
                    type: "View",
                    props: {
                      testID: "testID-74",
                    },
                    actions: [],
                    styles: {
                      height: 22,
                      width: 22,
                    },
                  },
                ],
              },
              {
                type: "View",
                props: { testID: "testID-75" },
                actions: [],
                styles: {
                  backgroundColor: "#E5E7EB",
                  height: 1,
                  width: "100%",
                },
              },
              {
                type: "Image",
                props: {
                  uri:
                    "https://d13ir53smqqeyp.cloudfront.net/player-images/partner-image/MenGoogle/Bottomsheet_Content.png",
                  resizeMode: "contain",
                  testID: "testID-32",
                },
                actions: [],
                styles: {
                  height: 150,
                  width: 300,
                  marginTop: 20,
                  marginBottom: 12,
                },
              },

              /* ---------- BUTTON ROW (side-by-side) ---------- */
              {
                type: "View",
                props: { testID: "button-row" },
                actions: [],
                styles: {
                  width: "100%",
                  paddingLeft: 12,
                  paddingRight: 12,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                children: [
                  {
                    type: "Button",
                    props: {
                      title: [{ value: "ALLOW", isTemplateString: false }],
                      fontWeight: "bold",
                      testID: "testID-38-left",
                    },
                    actions: [
                      { name: "dismiss", type: "dismiss", params: {} },
                      {
                        name: "emitNativeEvent",
                        type: "emitNativeEvent",
                        params: {
                          eventName: "NOTIFICATION_BOTTOMSHEET_NUDGE",
                          eventParams: [
                            {
                              name: "111",
                              value: [{ value: "2", isTemplateString: false }],
                              type: "string",
                            },
                          ],
                        },
                      },
                    ],
                    styles: {
                      backgroundColor: "#22C55E",
                      borderRadius: 16,
                      width: "48%",
                      paddingTop: 14,
                      paddingBottom: 14,
                      alignItems: "center",
                      textAlign: "center",
                      color: "#FFFFFF",
                      fontSize: 16,
                    },
                  },
                  {
                    type: "Button",
                    props: {
                      title: [{ value: "DISMISS", isTemplateString: false }],
                      fontWeight: "bold",
                      testID: "testID-38-right",
                    },
                    actions: [
                      { name: "dismiss", type: "dismiss", params: {} },
                      {
                        name: "analyticsEvent",
                        type: "analyticsEvent",
                        params: {
                          eventName: "notifications_later_clicked",
                          eventParams: [],
                        },
                      },
                    ],
                    styles: {
                      backgroundColor: "#E5E7EB",
                      borderRadius: 16,
                      width: "48%",
                      paddingTop: 14,
                      paddingBottom: 14,
                      alignItems: "center",
                      textAlign: "center",
                      color: "#111827",
                      fontSize: 16,
                    },
                  },
                ],
              },
              /* ---------- END BUTTON ROW ---------- */
            ],
          },
        ],
      } as ReactNativeJson;
    }
    // Basic BottomSheet
    return {
      ...baseTemplate,
      children: [
        {
          type: "View",
          props: { testID: `testID-${timestamp + 1}` },
          actions: [],
          styles: {
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            width: "100%",
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 8,
            paddingBottom: 8,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          },
          children: [
            {
              type: "View",
              props: { testID: `testID-${timestamp + 2}` },
              actions: [],
              styles: {
                width: "100%",
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
              children: [
                {
                  type: "Image",
                  props: {
                    uri:
                      "https://d13ir53smqqeyp.cloudfront.net/contain/site-banners/Close.svg",
                    resizeMode: "contain",
                    testID: `testID-${timestamp + 3}`,
                  },
                  actions: [
                    {
                      name: "dismiss",
                      type: "dismiss",
                      params: {},
                    },
                  ],
                  styles: {
                    height: 22,
                    width: 22,
                    marginLeft: 2,
                  },
                },
                {
                  type: "Text",
                  props: {
                    title: [
                      {
                        value: "Allow Notifications",
                        isTemplateString: false,
                      },
                    ],
                    fontWeight: "bold",
                    testID: `testID-${timestamp + 4}`,
                  },
                  actions: [],
                  styles: {
                    textAlign: "center",
                    color: "#111827",
                    fontSize: 18,
                  },
                },
                {
                  type: "View",
                  props: { testID: `testID-${timestamp + 5}` },
                  actions: [],
                  styles: {
                    height: 22,
                    width: 22,
                  },
                },
              ],
            },
            {
              type: "View",
              props: { testID: `testID-${timestamp + 6}` },
              actions: [],
              styles: {
                backgroundColor: "#E5E7EB",
                height: 1,
                width: "100%",
              },
            },
            {
              type: "Image",
              props: {
                uri:
                  "https://d13ir53smqqeyp.cloudfront.net/player-images/partner-image/MenGoogle/Bottomsheet_Content.png",
                resizeMode: "contain",
                testID: `testID-${timestamp + 7}`,
              },
              actions: [],
              styles: {
                height: 150,
                width: 300,
                marginTop: 20,
                marginBottom: 12,
              },
            },
            {
              type: "Button",
              props: {
                title: [
                  {
                    value: "ALLOW",
                    isTemplateString: false,
                  },
                ],
                fontWeight: "bold",
                testID: `testID-${timestamp + 8}`,
              },
              actions: [
                {
                  name: "dismiss",
                  type: "dismiss",
                  params: {},
                },
                {
                  name: "emitNativeEvent",
                  type: "emitNativeEvent",
                  params: {
                    eventName: "NOTIFICATION_BOTTOMSHEET_NUDGE",
                    eventParams: [
                      {
                        name: "111",
                        value: [
                          {
                            value: "2",
                            isTemplateString: false,
                          },
                        ],
                        type: "string",
                      },
                    ],
                  },
                },
              ],
              styles: {
                backgroundColor: "#22C55E",
                borderRadius: 16,
                width: "90%",
                marginBottom: 12,
                paddingTop: 14,
                paddingBottom: 14,
                alignItems: "center",
                textAlign: "center",
                color: "#FFFFFF",
                fontSize: 16,
              },
            },
          ],
        },
      ],
    } as ReactNativeJson;
  }

  if (type === NudgeType.POPUP) {
    if (variant === "popup-single-button") {
      // Popup with single button
      return {
        ...baseTemplate,
        children: [
          {
            type: "View",
            props: { testID: `testID-${timestamp + 1}` },
            actions: [],
            styles: {
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 16,
              paddingRight: 16,
              flexDirection: "column",
            },
            children: [
              {
                type: "View",
                props: { testID: `testID-${timestamp + 2}` },
                actions: [],
                styles: {
                  flexDirection: "row",
                  justifyContent: "flex-end",
                },
                children: [
                  {
                    type: "Image",
                    props: {
                      uri:
                        "https://d13ir53smqqeyp.cloudfront.net/contain/site-banners/Close.svg",
                      resizeMode: "contain",
                      testID: `testID-${timestamp + 3}`,
                    },
                    actions: [
                      {
                        name: "dismiss",
                        type: "dismiss",
                        params: {},
                      },
                    ],
                    styles: {
                      height: 24,
                      width: 24,
                    },
                  },
                ],
              },
            ],
          },
        ],
      } as ReactNativeJson;
    }
    // Basic Popup
    return {
      ...baseTemplate,
      children: [
        {
          type: "View",
          props: { testID: `testID-${timestamp + 1}` },
          actions: [],
          styles: {
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 16,
            paddingRight: 16,
            flexDirection: "column",
          },
          children: [],
        },
      ],
    } as ReactNativeJson;
  }

  if (type === NudgeType.TOOLTIP) {
    if (variant === "tooltip-arrow") {
      // Tooltip with arrow
      return {
        ...baseTemplate,
        children: [
          {
            type: "View",
            props: { testID: `testID-${timestamp + 1}` },
            actions: [],
            styles: {
              backgroundColor: "#333333",
              borderRadius: 8,
              paddingTop: 12,
              paddingBottom: 12,
              paddingLeft: 12,
              paddingRight: 12,
              flexDirection: "column",
            },
            children: [],
          },
        ],
      } as ReactNativeJson;
    }
    // Basic Tooltip
    return {
      ...baseTemplate,
      children: [
        {
          type: "View",
          props: { testID: `testID-${timestamp + 1}` },
          actions: [],
          styles: {
            backgroundColor: "#333333",
            borderRadius: 8,
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 12,
            paddingRight: 12,
            flexDirection: "column",
          },
          children: [],
        },
      ],
    } as ReactNativeJson;
  }

  return baseTemplate as ReactNativeJson;
};

const TEMPLATE_OPTIONS: Record<
  NudgeType,
  Array<{ id: string; label: string; description: string }>
> = {
  [NudgeType.TOOLTIP]: [
    {
      id: "basic-tooltip",
      label: "Basic Tooltip",
      description: "Simple tooltip",
    },
    {
      id: "tooltip-arrow",
      label: "Tooltip with Arrow",
      description: "Tooltip with pointing arrow",
    },
  ],
  [NudgeType.BOTTOMSHEET]: [
    {
      id: "basic-bottomsheet",
      label: "Basic BottomSheet",
      description: "Standard bottom sheet",
    },
    {
      id: "bottomsheet-cta",
      label: "BottomSheet with CTA",
      description: "Bottom sheet with call-to-action",
    },
  ],
  [NudgeType.POPUP]: [
    {
      id: "basic-popup",
      label: "Basic Popup",
      description: "Standard popup",
    },
    {
      id: "popup-single-button",
      label: "Popup with Single Button",
      description: "Popup with action button",
    },
  ],
};

export default function TemplateTab({ control, errors }: TemplateTabProps) {
  const actions = useWatch({
    control,
    name: "nudgeSelection.actions",
  });
  const engagementType = actions?.[0]?.type as NudgeType | undefined;

  const templates = engagementType
    ? TEMPLATE_OPTIONS[engagementType] || []
    : [];

  const getTemplateDescription = (type: NudgeType | undefined): string => {
    if (!type) return "Choose a template variant for your engagement";
    const typeLabels: Record<NudgeType, string> = {
      [NudgeType.TOOLTIP]: "tooltip",
      [NudgeType.BOTTOMSHEET]: "bottom sheet",
      [NudgeType.POPUP]: "popup",
    };
    return `Choose a template variant for your ${typeLabels[type]} engagement`;
  };

  return (
    <Box sx={templateTabStyles.container}>
      <Typography sx={templateTabStyles.title}>Select Template</Typography>
      <Typography sx={templateTabStyles.subtitle}>
        {getTemplateDescription(engagementType)}
      </Typography>
      {!engagementType ? (
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          Please select an engagement type first
        </Typography>
      ) : (
        <Box sx={templateTabStyles.templatesGrid}>
          <Controller
            name="nudgeSelection.actions.0.template"
            control={control}
            render={({ field }: { field: FieldValues }) => (
              <>
                {templates.map((template) => {
                  // Check if the current template matches this specific template variant
                  let isSelected = false;
                  if (field.value) {
                    const currentTemplate = field.value as ReactNativeJson;
                    // Store template variant ID in props to identify which template is selected
                    const storedVariantId =
                      currentTemplate.props?.templateVariantId;
                    isSelected = storedVariantId === template.id;
                  }

                  const handleTemplateSelect = () => {
                    const templateJson = generateTemplate(
                      engagementType!,
                      template.id
                    );
                    field.onChange(templateJson);
                  };

                  // Generate preview template for visual display
                  const previewTemplate = generateTemplate(
                    engagementType!,
                    template.id
                  );

                  return (
                    <Card
                      key={template.id}
                      sx={{
                        ...templateTabStyles.templateCard,
                        ...(isSelected
                          ? templateTabStyles.templateCardSelected
                          : {}),
                        position: "relative",
                        cursor: "pointer",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "#FFFFFF",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "#E0E0E0",
                        boxShadow: 2,
                      }}
                      onClick={handleTemplateSelect}
                    >
                      {/* Render preview based on engagement type */}
                      {engagementType === NudgeType.BOTTOMSHEET && (
                        <Box
                          sx={{
                            width: "100%",
                            height: 250,
                            position: "relative",
                            bgcolor: "#F5F5F5",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "flex-end",
                          }}
                        >
                          {/* Bottomsheet container */}
                          <Box
                            sx={{
                              width: "100%",
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              bgcolor: "#FFFFFF",
                              borderTopLeftRadius: 16,
                              borderTopRightRadius: 16,
                              boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
                              display: "flex",
                              flexDirection: "column",
                              minHeight: "70%",
                              maxHeight: "85%",
                            }}
                          >
                            {/* Handle bar */}
                            <Box
                              sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pt: 1.5,
                                pb: 1,
                                flexShrink: 0,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 40,
                                  height: 4,
                                  bgcolor: "#BDBDBD",
                                  borderRadius: 2,
                                }}
                              />
                            </Box>
                            {/* Content section */}
                            <Box
                              sx={{
                                px: 2,
                                pt: 1,
                                pb: 3,
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                justifyContent: "space-between",
                                minHeight: 0,
                              }}
                            >
                              {/* Text content */}
                              <Box sx={{ textAlign: "center" }}>
                                <Typography
                                  sx={{
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                    mb: 0.5,
                                    color: "text.primary",
                                  }}
                                >
                                  {template.id === "bottomsheet-cta"
                                    ? "Best offers, just for you!"
                                    : "Upto 60% off just for you!"}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    color: "text.secondary",
                                  }}
                                >
                                  {template.id === "bottomsheet-cta"
                                    ? "Explore our curated selection of deals"
                                    : "Book from our curated selection of beach stays now"}
                                </Typography>
                              </Box>
                              {/* Buttons - always at bottom */}
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1.5,
                                  justifyContent: "center",
                                  mt: 2,
                                  flexShrink: 0,
                                }}
                              >
                                {template.id === "bottomsheet-cta" ? (
                                  <>
                                    {/* Two buttons for 2 CTA variant */}
                                    <Box
                                      sx={{
                                        px: 2,
                                        py: 0.75,
                                        borderRadius: 1,
                                        fontSize: "0.75rem",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        bgcolor: "white",
                                        color: "text.primary",
                                        cursor: "default",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Dismiss
                                    </Box>
                                    <Box
                                      sx={{
                                        px: 2,
                                        py: 0.75,
                                        borderRadius: 1,
                                        fontSize: "0.75rem",
                                        bgcolor: "#000000",
                                        color: "white",
                                        cursor: "default",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Explore
                                    </Box>
                                  </>
                                ) : (
                                  /* Single button for basic variant */
                                  <Box
                                    sx={{
                                      px: 2.5,
                                      py: 0.75,
                                      borderRadius: 1,
                                      fontSize: "0.75rem",
                                      bgcolor: "#000000",
                                      color: "white",
                                      cursor: "default",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Book now
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      )}
                      {engagementType === NudgeType.POPUP && (
                        <Box
                          sx={{
                            width: "100%",
                            minHeight: 200,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              textAlign: "center",
                            }}
                          >
                            {template.label}
                          </Typography>
                        </Box>
                      )}
                      {engagementType === NudgeType.TOOLTIP && (
                        <Box
                          sx={{
                            width: "100%",
                            minHeight: 200,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 2,
                            bgcolor: "#333333",
                            borderRadius: 8,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              color: "#FFFFFF",
                              textAlign: "center",
                            }}
                          >
                            {template.label}
                          </Typography>
                        </Box>
                      )}
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                        }}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect();
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      {isSelected && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            bgcolor: "success.main",
                            color: "white",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: "0.75rem",
                          }}
                        >
                          Selected
                        </Box>
                      )}
                    </Card>
                  );
                })}
              </>
            )}
          />
        </Box>
      )}
    </Box>
  );
}
