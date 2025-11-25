"use client";

import { Box, Typography, Card, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  Control,
  FieldErrors,
  useWatch,
  Controller,
  FieldValues,
  useFormContext,
} from "react-hook-form";
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

/* ----------------- POPUP TEMPLATES (unchanged) ----------------- */
export const getDefaultPopupTemplate = (): ReactNativeJson => ({
  type: "POPUP",
  props: {
    testID: "testID-49",
  },
  actions: [],
  styles: {},
  children: [
    {
      type: "View",
      props: {
        testID: "testID-50",
      },
      actions: [],
      styles: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        height: 250,
        width: "80%",
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 4,
        paddingBottom: 4,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      children: [
        {
          type: "View",
          props: {
            testID: "testID-51",
          },
          actions: [],
          styles: {
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
          children: [
            {
              type: "Image",
              props: {
                uri:
                  "https://d13ir53smqqeyp.cloudfront.net/contain/site-banners/5Team21May.jpg",
                resizeMode: "cover",
                testID: "testID-38",
              },
              actions: [],
              styles: {
                height: 100,
                width: 120,
                marginBottom: 12,
              },
            },
          ],
        },
        {
          type: "View",
          props: {
            testID: "testID-52",
          },
          actions: [],
          styles: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
          children: [
            {
              type: "Text",
              props: {
                title: [
                  {
                    value: "Lifetime free card for you!",
                    isTemplateString: false,
                  },
                ],
                fontWeight: "bold",
                testID: "testID-57",
              },
              actions: [],
              styles: {
                fontSize: 16,
              },
            },
            {
              type: "Text",
              props: {
                title: [
                  {
                    value: "Experience life unlimited",
                    isTemplateString: false,
                  },
                ],
                fontWeight: "regular",
                testID: "testID-58",
              },
              actions: [],
              styles: {
                marginBottom: 12,
                fontSize: 14,
              },
            },
          ],
        },
        {
          type: "View",
          props: {
            testID: "testID-53",
          },
          actions: [],
          styles: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
          children: [
            {
              type: "View",
              props: {
                testID: "testID-54",
              },
              actions: [],
              styles: {
                backgroundColor: "#e0e0e0",
                borderRadius: 8,
                marginRight: 12,
                marginBottom: 12,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              },
              children: [
                {
                  type: "Button",
                  props: {
                    title: [
                      {
                        value: "Dismiss",
                        isTemplateString: false,
                      },
                    ],
                    fontWeight: "bold",
                    testID: "testID-79",
                  },
                  actions: [
                    {
                      name: "dismiss",
                      type: "dismiss",
                      params: {},
                    },
                  ],
                  styles: {
                    width: 100,
                    marginTop: 8,
                    marginBottom: 10,
                    textAlign: "center",
                    fontSize: 14,
                  },
                },
              ],
            },
            {
              type: "View",
              props: {
                testID: "testID-55",
              },
              actions: [],
              styles: {
                backgroundColor: "#000000",
                borderRadius: 8,
                width: 100,
                marginRight: 12,
                marginBottom: 12,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              },
              children: [
                {
                  type: "Button",
                  props: {
                    title: [
                      {
                        value: "Explore",
                        isTemplateString: false,
                      },
                    ],
                    fontWeight: "bold",
                    testID: "testID-80",
                  },
                  actions: [
                    {
                      name: "dismiss",
                      type: "dismiss",
                      params: {},
                    },
                  ],
                  styles: {
                    marginTop: 8,
                    marginBottom: 10,
                    textAlign: "center",
                    color: "#FFFFFF",
                    fontSize: 14,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

export const getPopupWithSingleButtonTemplate = (): ReactNativeJson => ({
  type: "POPUP",
  props: { testID: "testID-7" },
  actions: [],
  styles: {},
  children: [
    {
      type: "View",
      props: { testID: "testID-8" },
      actions: [],
      styles: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        height: 240,
        width: "80%",
        paddingBottom: 16,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      children: [
        {
          type: "View",
          props: { testID: "testID-9" },
          actions: [],
          styles: {
            width: "95%",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          },
          children: [
            {
              type: "Image",
              props: {
                uri:
                  "https://d13ir53smqqeyp.cloudfront.net/contain/site-banners/Close.svg",
                resizeMode: "contain",
                testID: "testID-641",
              },
              actions: [{ name: "dismiss", type: "dismiss", params: {} }],
              styles: {
                height: 20,
                width: 20,
                marginLeft: 12,
                marginRight: 4,
                marginTop: 4,
                marginBottom: 4,
              },
            },
          ],
        },
        {
          type: "View",
          props: { testID: "testID-10" },
          actions: [],
          styles: {
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
          children: [
            {
              type: "Image",
              props: {
                uri:
                  "https://d13ir53smqqeyp.cloudfront.net/contain/site-banners/5Team21May.jpg",
                resizeMode: "cover",
                testID: "testID-656",
              },
              actions: [],
              styles: { height: 100, width: 120, marginBottom: 12 },
            },
          ],
        },
        {
          type: "View",
          props: { testID: "testID-11" },
          actions: [],
          styles: {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
          children: [
            {
              type: "Text",
              props: {
                title: [
                  {
                    value: "Lifetime free card for you!!",
                    isTemplateString: false,
                  },
                ],
                fontWeight: "bold",
                testID: "testID-682",
              },
              actions: [],
              styles: { fontSize: 16 },
            },
            {
              type: "Text",
              props: {
                title: [
                  {
                    value: "Experience life unlimited!",
                    isTemplateString: false,
                  },
                ],
                fontWeight: "regular",
                testID: "testID-683",
              },
              actions: [],
              styles: {},
            },
          ],
        },
        {
          type: "View",
          props: { testID: "testID-12" },
          actions: [],
          styles: {
            backgroundColor: "yellow",
            borderRadius: 8,
            marginTop: 8,
            marginBottom: 8,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
          children: [
            {
              type: "View",
              props: { testID: "testID-13" },
              actions: [],
              styles: {
                backgroundColor: "black",
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              },
              children: [
                {
                  type: "Button",
                  props: {
                    title: [{ value: "Apply now", isTemplateString: false }],
                    fontWeight: "bold",
                    testID: "testID-704",
                  },
                  actions: [{ name: "dismiss", type: "dismiss", params: {} }],
                  styles: {
                    width: 100,
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 10,
                    marginBottom: 10,
                    paddingLeft: 16,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: 14,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
/* --------------------------------------------------------------- */

export const generateTemplate = (
  type: NudgeType,
  variant: string
): ReactNativeJson => {
  const timestamp = Date.now();
  const baseTemplate = {
    type,
    props: { testID: `testID-${timestamp}`, templateVariantId: variant },
    actions: [],
    styles: {},
    children: [],
  };

  if (type === NudgeType.NUDGE_UI) {
    if (variant === "bottomsheet-cta") {
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
                    props: { testID: "testID-74" },
                    actions: [],
                    styles: { height: 22, width: 22 },
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
            ],
          },
        ],
      } as ReactNativeJson;
    }

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
                paddingLeft: 8, // tighter sides
                paddingRight: 8, // ^
                paddingTop: 8,
                paddingBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
              children: [
                // move spacer to the LEFT (keeps title centered)
                {
                  type: "View",
                  props: { testID: `testID-${timestamp + 5}` },
                  actions: [],
                  styles: { height: 22, width: 22 },
                },

                {
                  type: "Text",
                  props: {
                    title: [
                      { value: "Allow Notifications", isTemplateString: false },
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
                // close icon goes to the RIGHT (same testID)
                {
                  type: "Image",
                  props: {
                    uri:
                      "https://d13ir53smqqeyp.cloudfront.net/contain/site-banners/Close.svg",
                    resizeMode: "contain",
                    testID: `testID-${timestamp + 3}`,
                  },
                  actions: [{ name: "dismiss", type: "dismiss", params: {} }],
                  styles: { height: 22, width: 22 }, // removed extra margin
                },
              ],
            },
            {
              type: "View",
              props: { testID: `testID-${timestamp + 6}` },
              actions: [],
              styles: { backgroundColor: "#E5E7EB", height: 1, width: "100%" },
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
                title: [{ value: "ALLOW", isTemplateString: false }],
                fontWeight: "bold",
                testID: `testID-${timestamp + 8}`,
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
      const template = getPopupWithSingleButtonTemplate();
      return {
        ...template,
        props: {
          ...template.props,
          testID: `testID-${timestamp}`,
          templateVariantId: variant,
        },
      } as ReactNativeJson;
    }
    const template = getDefaultPopupTemplate();
    return {
      ...template,
      props: {
        ...template.props,
        testID: `testID-${timestamp}`,
        templateVariantId: variant,
      },
    } as ReactNativeJson;
  }

  if (type === NudgeType.TOOLTIP) {
    console.log("tooltip", type);
    return {
      type: "TOOLTIP",
      props: {
        testID: `testID-${timestamp}`,
        title: "Lifetime free card for you!",
        subTitle: "Experience life unlimited",
        position: "top",
        titleFontSize: 14,
        subTitleFontSize: 10,
        autoDismissMs: 0,
        titleColor: "#FFFFFF",
        subTitleColor: "#FFFFFF",
        arrowSize: 16,
        titleAlignment: "left",
        subTitleAlignment: "left",
        dismissOnOutsideTouch: true,
        triggerDelay: 1000,
        titleFontFamily: "Roboto",
        subTitleFontFamily: "Roboto",
        templateVariantId: variant,
      },
      actions: [],
      styles: {
        backgroundColor: "#0096C7",
        borderRadius: 12,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 12,
        paddingBottom: 12,
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 8,
        marginRight: 8,
      },
      children: [],
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
  ],
  [NudgeType.NUDGE_UI]: [
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
    { id: "basic-popup", label: "Basic Popup", description: "Standard popup" },
    {
      id: "popup-single-button",
      label: "Popup with Single Button",
      description: "Popup with action button",
    },
  ],
};

export default function TemplateTab({ control }: TemplateTabProps) {
  const { setValue } = useFormContext<CreateJourneyFormData>();
  const actions = useWatch({ control, name: "nudgeSelection.actions" });
  const engagementType = actions?.[0]?.type as NudgeType | undefined;

  const templates = engagementType
    ? TEMPLATE_OPTIONS[engagementType] || []
    : [];

  const getTemplateDescription = (type: NudgeType | undefined): string => {
    if (!type) return "Choose a template variant for your engagement";
    const typeLabels: Record<NudgeType, string> = {
      [NudgeType.TOOLTIP]: "tooltip",
      [NudgeType.NUDGE_UI]: "bottom sheet",
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
                  let isSelected = false;
                  if (field.value) {
                    const currentTemplate = field.value as ReactNativeJson;
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
                    // Also set the variant field on the action
                    setValue(
                      "nudgeSelection.actions.0.variant",
                      template.id as any
                    );
                  };

                  return (
                    <Card
                      key={template.id}
                      sx={{
                        ...templateTabStyles.templateCard,
                        position: "relative",
                        cursor: "pointer",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "#FFFFFF",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: isSelected ? "success.main" : "#E0E0E0",
                        boxShadow: isSelected ? 4 : 2,
                        outline: isSelected ? "2px solid" : "none",
                        outlineColor: isSelected ? "success.main" : undefined,
                        transition:
                          "border-color 120ms ease, box-shadow 120ms ease",
                      }}
                      onClick={handleTemplateSelect}
                    >
                      {/* ---------- PREVIEW AREA ---------- */}
                      {engagementType === NudgeType.TOOLTIP && (
                        <Box
                          sx={{
                            width: "100%",
                            height: 200,
                            position: "relative",
                            bgcolor: "#F5F5F5",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 1,
                            p: 2,
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {(() => {
                              const currentTemplate = field.value as
                                | ReactNativeJson
                                | undefined;
                              const tooltipProps = (currentTemplate?.props ||
                                {}) as Record<string, any>;
                              const tooltipStyles = (currentTemplate?.styles ||
                                {}) as Record<string, any>;

                              const title =
                                tooltipProps.title ||
                                "Lifetime free card for you!";
                              const subTitle =
                                tooltipProps.subTitle ||
                                "Experience life unlimited";
                              const backgroundColor =
                                tooltipStyles.backgroundColor || "#0096C7";
                              const position = tooltipProps.position || "top";
                              const arrowSize = tooltipProps.arrowSize || 16;

                              // Get position-based container styles
                              const getContainerStyles = () => {
                                switch (position) {
                                  case "top":
                                    return {
                                      alignItems: "flex-start",
                                      justifyContent: "center",
                                      paddingTop: "10%",
                                    };
                                  case "bottom":
                                    return {
                                      alignItems: "flex-end",
                                      justifyContent: "center",
                                      paddingBottom: "10%",
                                    };
                                  case "left":
                                    return {
                                      alignItems: "center",
                                      justifyContent: "flex-start",
                                      paddingLeft: "5%",
                                    };
                                  case "right":
                                    return {
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                      paddingRight: "5%",
                                    };
                                  default:
                                    return {
                                      alignItems: "center",
                                      justifyContent: "center",
                                    };
                                }
                              };

                              return (
                                <Box
                                  sx={{
                                    position: "relative",
                                    display: "flex",
                                    width: "100%",
                                    height: "100%",
                                    ...getContainerStyles(),
                                  }}
                                >
                                  <Box
                                    sx={{
                                      backgroundColor,
                                      borderRadius: 2,
                                      padding: "12px 16px",
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 0.5,
                                      position: "relative",
                                      maxWidth: "80%",
                                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                      overflow: "visible",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: tooltipProps.titleFontSize
                                          ? `${tooltipProps.titleFontSize}px`
                                          : "0.875rem",
                                        fontWeight: "bold",
                                        color:
                                          tooltipProps.titleColor || "#FFFFFF",
                                        lineHeight: 1.2,
                                        textAlign:
                                          tooltipProps.titleAlignment || "left",
                                      }}
                                    >
                                      {typeof title === "string"
                                        ? title
                                        : title[0]?.value || ""}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: tooltipProps.subTitleFontSize
                                          ? `${tooltipProps.subTitleFontSize}px`
                                          : "0.75rem",
                                        color:
                                          tooltipProps.subTitleColor ||
                                          "#FFFFFF",
                                        lineHeight: 1.2,
                                        textAlign:
                                          tooltipProps.subTitleAlignment ||
                                          "left",
                                      }}
                                    >
                                      {typeof subTitle === "string"
                                        ? subTitle
                                        : subTitle[0]?.value || ""}
                                    </Typography>
                                    {/* Arrow indicator - show if arrowSize > 0 */}
                                    {arrowSize > 0 &&
                                      (() => {
                                        const arrowSizePx = `${arrowSize}px`;
                                        const baseArrowStyle: React.CSSProperties = {
                                          position: "absolute",
                                          width: 0,
                                          height: 0,
                                        };

                                        switch (position) {
                                          case "top":
                                            return (
                                              <Box
                                                sx={{
                                                  ...baseArrowStyle,
                                                  bottom: `calc(-${arrowSizePx} + 1px)`,
                                                  left: `${arrowSize}px`,
                                                  borderLeft: `${arrowSizePx} solid transparent`,
                                                  borderRight: `${arrowSizePx} solid transparent`,
                                                  borderTop: `${arrowSizePx} solid ${backgroundColor}`,
                                                }}
                                              />
                                            );
                                          case "bottom":
                                            return (
                                              <Box
                                                sx={{
                                                  ...baseArrowStyle,
                                                  top: `calc(-${arrowSizePx} + 1px)`,
                                                  left: `${arrowSize}px`,
                                                  borderLeft: `${arrowSizePx} solid transparent`,
                                                  borderRight: `${arrowSizePx} solid transparent`,
                                                  borderBottom: `${arrowSizePx} solid ${backgroundColor}`,
                                                }}
                                              />
                                            );
                                          case "left":
                                            return (
                                              <Box
                                                sx={{
                                                  ...baseArrowStyle,
                                                  right: `-${arrowSizePx}`,
                                                  top: "50%",
                                                  transform: "translateY(-50%)",
                                                  borderTop: `${arrowSizePx} solid transparent`,
                                                  borderBottom: `${arrowSizePx} solid transparent`,
                                                  borderLeft: `${arrowSizePx} solid ${backgroundColor}`,
                                                }}
                                              />
                                            );
                                          case "right":
                                            return (
                                              <Box
                                                sx={{
                                                  ...baseArrowStyle,
                                                  left: `-${arrowSizePx}`,
                                                  top: "50%",
                                                  transform: "translateY(-50%)",
                                                  borderTop: `${arrowSizePx} solid transparent`,
                                                  borderBottom: `${arrowSizePx} solid transparent`,
                                                  borderRight: `${arrowSizePx} solid ${backgroundColor}`,
                                                }}
                                              />
                                            );
                                          default:
                                            return (
                                              <Box
                                                sx={{
                                                  ...baseArrowStyle,
                                                  bottom: `calc(-${arrowSizePx} + 1px)`,
                                                  left: `${arrowSize}px`,
                                                  borderLeft: `${arrowSizePx} solid transparent`,
                                                  borderRight: `${arrowSizePx} solid transparent`,
                                                  borderTop: `${arrowSizePx} solid ${backgroundColor}`,
                                                }}
                                              />
                                            );
                                        }
                                      })()}
                                  </Box>
                                </Box>
                              );
                            })()}
                          </Box>
                        </Box>
                      )}

                      {engagementType === NudgeType.NUDGE_UI && (
                        <Box
                          sx={{
                            width: "100%",
                            height: 250,
                            position: "relative",
                            bgcolor: "#F5F5F5",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "flex-end",
                            borderRadius: 1,
                          }}
                        >
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
                              zIndex: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pt: 1,
                                pb: 0.75,
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
                            <Box
                              sx={{
                                px: 1.5,
                                pt: 0.75,
                                pb: 2,
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                justifyContent: "space-between",
                                minHeight: 0,
                              }}
                            >
                              <Box
                                sx={{
                                  textAlign: "center",
                                  width: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                    mb: 0.5,
                                    color: "text.primary",
                                    lineHeight: 1.2,
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
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {template.id === "bottomsheet-cta"
                                    ? "Explore our curated selection of deals"
                                    : "Book from our curated selection of beach stays now"}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "center",
                                  mt: 1.5,
                                  flexShrink: 0,
                                  width: "100%",
                                  alignItems: "center",
                                }}
                              >
                                {template.id === "bottomsheet-cta" ? (
                                  <>
                                    <Box
                                      sx={{
                                        px: 1.5,
                                        py: 0.625,
                                        borderRadius: 1,
                                        fontSize: "0.75rem",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        bgcolor: "white",
                                        color: "text.primary",
                                        cursor: "default",
                                        fontWeight: 500,
                                        textAlign: "center",
                                        minWidth: 80,
                                      }}
                                    >
                                      Dismiss
                                    </Box>
                                    <Box
                                      sx={{
                                        px: 1.5,
                                        py: 0.625,
                                        borderRadius: 1,
                                        fontSize: "0.75rem",
                                        bgcolor: "#000000",
                                        color: "white",
                                        cursor: "default",
                                        fontWeight: 500,
                                        textAlign: "center",
                                        minWidth: 80,
                                      }}
                                    >
                                      Explore
                                    </Box>
                                  </>
                                ) : (
                                  <Box
                                    sx={{
                                      px: 2,
                                      py: 0.625,
                                      borderRadius: 1,
                                      fontSize: "0.75rem",
                                      bgcolor: "#000000",
                                      color: "white",
                                      cursor: "default",
                                      fontWeight: 500,
                                      textAlign: "center",
                                      minWidth: 100,
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
                            height: 250,
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: 1,
                            bgcolor: "#F5F5F5",
                          }}
                        >
                          {/* Backdrop */}
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              bgcolor: "rgba(0, 0, 0, 0.5)",
                              zIndex: 0,
                            }}
                          />
                          {/* Dialog */}
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 1,
                              pointerEvents: "none",
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                width: 280,
                                maxWidth: "82%",
                                borderRadius: 3,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                bgcolor: "#FFFFFF",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                px: 2,
                                py: 1.5,
                              }}
                            >
                              {/* Image */}
                              <Box
                                sx={{
                                  width: 80,
                                  height: 60,
                                  bgcolor: "#F5F5F5",
                                  borderRadius: 1,
                                  mb: 1,
                                  alignSelf: "center",
                                }}
                              />
                              {/* Copy */}
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  width: "100%",
                                  mb: 1.5,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                    textAlign: "center",
                                    color: "text.primary",
                                    mb: 0.5,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {template.id === "popup-single-button"
                                    ? "Lifetime free card for you!!"
                                    : "Lifetime free card for you!"}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.75rem",
                                    color: "text.secondary",
                                    textAlign: "center",
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {template.id === "popup-single-button"
                                    ? "Experience life unlimited!"
                                    : "Experience life unlimited"}
                                </Typography>
                              </Box>
                              {/* Buttons */}
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "center",
                                  width: "100%",
                                  alignItems: "center",
                                }}
                              >
                                {template.id === "popup-single-button" ? (
                                  <Box
                                    sx={{
                                      px: 2,
                                      py: 0.625,
                                      borderRadius: 1,
                                      fontSize: "0.75rem",
                                      bgcolor: "#000000",
                                      color: "white",
                                      fontWeight: 500,
                                      textAlign: "center",
                                      minWidth: 100,
                                    }}
                                  >
                                    Apply now
                                  </Box>
                                ) : (
                                  <>
                                    <Box
                                      sx={{
                                        px: 1.5,
                                        py: 0.625,
                                        borderRadius: 1,
                                        fontSize: "0.75rem",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        bgcolor: "#E0E0E0",
                                        color: "text.primary",
                                        fontWeight: 500,
                                        textAlign: "center",
                                        minWidth: 80,
                                      }}
                                    >
                                      Dismiss
                                    </Box>
                                    <Box
                                      sx={{
                                        px: 1.5,
                                        py: 0.625,
                                        borderRadius: 1,
                                        fontSize: "0.75rem",
                                        bgcolor: "#000000",
                                        color: "white",
                                        fontWeight: 500,
                                        textAlign: "center",
                                        minWidth: 80,
                                      }}
                                    >
                                      Explore
                                    </Box>
                                  </>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      )}
                      {/* ---------- /PREVIEW AREA ---------- */}

                      {/* Top-right "+" always visible */}
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 3,
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect();
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>

                      {/* Selected badge */}
                      {isSelected && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            zIndex: 3,
                            bgcolor: "success.main",
                            color: "white",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: "0.75rem",
                            lineHeight: 1,
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
