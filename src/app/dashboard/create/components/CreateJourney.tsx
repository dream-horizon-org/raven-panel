"use client";

import { Box, CircularProgress } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useEventsList } from "@/hooks/useEventsList";
import { useFiltersList } from "@/hooks/useFiltersList";
import { useSystemProperties } from "@/hooks/useSystemProperties";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createJourneyPageStyles } from "./content/styles/createJourneyPageStyles";
import { generateRandomJourneyName } from "../utils/journeyUtils";
import { CreateJourneyFormData } from "../types/journey.interface";
import { getJourneyFormDefaults } from "../constants/journeyConstants";
import JourneyHeader from "./JourneyHeader";
import JourneyTabs from "./JourneyTabs";
import CohortSection from "./CohortSection";
import ScheduleSection from "./ScheduleSection";
import JourneyFrequencySection from "./JourneyFrequencySection";
import JourneyActions from "./JourneyActions";
import EngagementSidePanel from "./EngagementSidePanel";
import JourneyFlowBuilderIntegrated from "./JourneyFlowBuilderIntegrated";
import { createJourney } from "@/api/services/createJourney.service";
import { updateJourney } from "@/api/services/updateJourney.service";
import { getJourneyById } from "@/api/services/getJourney.service";
import { updateJourneyStatus } from "@/api/services/journeyStatus.service";
import { toast } from "sonner";
import { parseJourneyDataToFormData } from "../utils/parseJourneyData";
import { useWatch, Path } from "react-hook-form";
import { validateTemplate } from "../utils/validation";
import { usePermissions } from "@/app/providers/PermissionProvider";
import { AxiosError } from "axios";

interface CreateJourneyPageProps {
  journeyId?: string;
  isCloneMode?: boolean;
}

export default function CreateJourneyPage({
  journeyId: journeyIdProp,
  isCloneMode = false,
}: CreateJourneyPageProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const journeyIdFromQuery = searchParams?.get("id");
  const journeyId = journeyIdProp || journeyIdFromQuery || undefined;

  const { data: filtersData } = useFiltersList();
  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    isFetching: isFetchingEvents,
  } = useEventsList();
  const {
    data: systemPropertiesData,
    isFetching: isFetchingSystemProperties,
  } = useSystemProperties();
  const { systemPropertyNames, systemPropertyTypes } = useMemo(() => {
    if (!systemPropertiesData) {
      return {
        systemPropertyNames: [],
        systemPropertyTypes: new Map<string, string>(),
      };
    }
    const data = systemPropertiesData.data;
    if (!data) {
      return {
        systemPropertyNames: [],
        systemPropertyTypes: new Map<string, string>(),
      };
    }
    const names: string[] = [];
    const types = new Map<string, string>();
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item?.propertyName) {
          names.push(item.propertyName);
          if (item.type) {
            const normalizedType = item.type.toLowerCase();
            types.set(item.propertyName, normalizedType);
          }
        }
      });
    } else if (Array.isArray(data.names)) {
      data.names.forEach((name: string) => {
        names.push(name);
      });
    } else if (Array.isArray(data.properties)) {
      data.properties.forEach(
        (prop: string | { propertyName: string; type?: string }) => {
          if (typeof prop === "string") {
            names.push(prop);
          } else if (prop?.propertyName) {
            names.push(prop.propertyName);
            if (prop.type) {
              const normalizedType = prop.type.toLowerCase();
              types.set(prop.propertyName, normalizedType);
            }
          }
        }
      );
    } else if (Array.isArray(data.systemProperties)) {
      data.systemProperties.forEach(
        (prop: string | { propertyName: string; type?: string }) => {
          if (typeof prop === "string") {
            names.push(prop);
          } else if (prop?.propertyName) {
            names.push(prop.propertyName);
            if (prop.type) {
              const normalizedType = prop.type.toLowerCase();
              types.set(prop.propertyName, normalizedType);
            }
          }
        }
      );
    }
    return { systemPropertyNames: names, systemPropertyTypes: types };
  }, [systemPropertiesData]);
  const methods = useForm<CreateJourneyFormData, object, CreateJourneyFormData>(
    {
      defaultValues: {
        ...getJourneyFormDefaults(),
        ctaMetadata: {
          ...getJourneyFormDefaults().ctaMetadata,
          ctaTitle: generateRandomJourneyName(),
        },
        schedule: {
          ...getJourneyFormDefaults().schedule,
          startType: "immediate" as "immediate" | "scheduled",
          enableImmediateStart: false,
          enableScheduledStart: false,
        },
      },
    }
  );

  // Watch journey frequency checkboxes to clear error when any is checked
  // Note: These are watched but not directly used - they trigger form validation
  useWatch({
    control: methods.control,
    name: "journeyFrequency.enableTimesInSession",
  });
  useWatch({
    control: methods.control,
    name: "journeyFrequency.enableMaxTimesInPeriod",
  });
  useWatch({
    control: methods.control,
    name: "journeyFrequency.enableMaxTimesInLifetime",
  });
  const {
    control,
    handleSubmit,
    formState,
    formState: { errors },
    trigger,
    reset,
    setError,
    clearErrors,
    setValue,
    getValues,
  } = methods;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingJourney, setIsLoadingJourney] = useState(false);
  const hasFetchedJourneyRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const fetchJourneyData = async () => {
      if (!journeyId || hasFetchedJourneyRef.current === journeyId) return;

      try {
        setIsLoadingJourney(true);
        hasFetchedJourneyRef.current = journeyId;
        const journeyResponse = await getJourneyById(Number(journeyId));
        const formData = parseJourneyDataToFormData(journeyResponse);

        // Match event with events list if available
        if (
          formData.ruleEngine.currentDropdownSelectedEvent &&
          eventsData?.data?.eventList &&
          eventsData.data.eventList.length > 0
        ) {
          const eventName =
            formData.ruleEngine.currentDropdownSelectedEvent.label;
          const matchingEvent = eventsData.data.eventList.find(
            (event) => event.metadata.eventName === eventName
          );
          if (matchingEvent) {
            const eventIndex = eventsData.data.eventList.indexOf(matchingEvent);
            formData.ruleEngine.currentDropdownSelectedEvent = {
              id: eventIndex + 1,
              label: eventName,
            };
          }
        }

        reset(formData);
      } catch (error) {
        console.error("Error fetching journey data:", error);
        toast.error("Failed to load journey data. Please try again.");
        hasFetchedJourneyRef.current = undefined;
      } finally {
        setIsLoadingJourney(false);
      }
    };

    if (journeyId) {
      fetchJourneyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeyId, isCloneMode, eventsData]);

  // Update event ID when events list loads after journey data
  useEffect(() => {
    if (
      journeyId &&
      !isLoadingJourney &&
      eventsData?.data?.eventList &&
      eventsData.data.eventList.length > 0
    ) {
      const currentEvent = getValues("ruleEngine.currentDropdownSelectedEvent");
      if (currentEvent?.label && (currentEvent.id === 0 || !currentEvent.id)) {
        const matchingEvent = eventsData.data.eventList.find(
          (event) => event.metadata.eventName === currentEvent.label
        );
        if (matchingEvent) {
          const eventIndex = eventsData.data.eventList.indexOf(matchingEvent);
          setValue("ruleEngine.currentDropdownSelectedEvent", {
            id: eventIndex + 1,
            label: currentEvent.label,
          });
        }
      }
    }
  }, [journeyId, isLoadingJourney, eventsData, setValue, getValues]);
  const onFormSubmit = async (data: CreateJourneyFormData) => {
    console.log("data", data);

    if (data.schedule?.enableScheduledStart) {
      if (!data.schedule.startDate || !data.schedule.startTime) {
        if (!data.schedule.startDate) {
          setError("schedule.startDate", {
            type: "required",
            message:
              "Start date is required when 'At specific date/time' is selected",
          });
        }
        if (!data.schedule.startTime) {
          setError("schedule.startTime", {
            type: "required",
            message:
              "Start time is required when 'At specific date/time' is selected",
          });
        }
        toast.error(
          "Please fill in both start date and time when 'At specific date/time' is selected"
        );
        return;
      }

      const startDateTime = new Date(
        `${data.schedule.startDate}T${data.schedule.startTime}`
      );
      const now = new Date();
      if (startDateTime < now) {
        setError("schedule.startDate", {
          type: "validation",
          message: "Start date and time cannot be in the past",
        });
        setError("schedule.startTime", {
          type: "validation",
          message: "Start date and time cannot be in the past",
        });
        toast.error("Start date and time cannot be in the past");
        return;
      }
    }

    if (data.schedule?.enableScheduledEnd) {
      if (!data.schedule.endDate || !data.schedule.endTime) {
        if (!data.schedule.endDate) {
          setError("schedule.endDate", {
            type: "required",
            message:
              "End date is required when 'At specific date/time' is selected",
          });
        }
        if (!data.schedule.endTime) {
          setError("schedule.endTime", {
            type: "required",
            message:
              "End time is required when 'At specific date/time' is selected",
          });
        }
        toast.error(
          "Please fill in both end date and time when 'At specific date/time' is selected"
        );
        return;
      }

      const endDateTime = new Date(
        `${data.schedule.endDate}T${data.schedule.endTime}`
      );
      const now = new Date();
      if (endDateTime < now) {
        setError("schedule.endDate", {
          type: "validation",
          message: "End date and time cannot be in the past",
        });
        setError("schedule.endTime", {
          type: "validation",
          message: "End date and time cannot be in the past",
        });
        toast.error("End date and time cannot be in the past");
        return;
      }
    }

    const hasScheduleErrors =
      errors.schedule?.startDate ||
      errors.schedule?.startTime ||
      errors.schedule?.endDate ||
      errors.schedule?.endTime ||
      errors.schedule?.enableScheduledStart ||
      errors.schedule?.enableScheduledEnd;

    if (hasScheduleErrors) {
      console.error("Error: Schedule validation failed");
      toast.error(
        "Please fix all schedule errors before creating/updating the journey."
      );
      return;
    }

    // Validate that templates are present
    if (
      !data.nudgeSelection?.actions ||
      data.nudgeSelection.actions.length === 0
    ) {
      console.error("Error: No actions/templates configured");
      toast.error(
        "Please configure at least one engagement template before creating the journey."
      );
      return;
    }
    // Validate that each action has a template
    const actionsWithoutTemplate = data.nudgeSelection.actions.filter(
      (action) => !action.template
    );
    if (actionsWithoutTemplate.length > 0) {
      console.error("Error: Some actions are missing templates");
      toast.error(
        "Please ensure all actions have templates configured before creating the journey."
      );
      return;
    }

    // Validate template structure, props, and styles
    let hasTemplateErrors = false;
    for (let i = 0; i < data.nudgeSelection.actions.length; i++) {
      const action = data.nudgeSelection.actions[i];
      if (action.template) {
        const basePath = `nudgeSelection.actions.${i}.template` as Path<
          CreateJourneyFormData
        >;
        const isValid = validateTemplate(
          action.template,
          basePath,
          setError,
          clearErrors
        );
        if (!isValid) {
          hasTemplateErrors = true;
        }
      }
    }

    // If template validation failed, stop submission
    if (hasTemplateErrors) {
      console.error("Error: Template validation failed");
      toast.error(
        "Please fix all template errors before creating the journey."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      let createdOrUpdatedJourneyId: number | null = null;

      // Step 1: Create or Update journey first
      if (journeyId && !isCloneMode) {
        // Update existing journey
        try {
          await updateJourney(Number(journeyId), data);
          createdOrUpdatedJourneyId = Number(journeyId);
          toast.success("Journey updated successfully!");
        } catch (updateError) {
          const error = updateError as AxiosError<{
            error: { message: string };
          }>;
          const errorMessage =
            error.response?.data?.error?.message ||
            error.message ||
            "Failed to update journey";
          toast.error(errorMessage);
          return;
        }
      } else {
        try {
          const response = await createJourney(data);

          if (typeof response === "number") {
            createdOrUpdatedJourneyId = response;
          } else if (response?.data) {
            if (typeof response.data === "number") {
              createdOrUpdatedJourneyId = response.data;
            } else if (response.data?.id) {
              createdOrUpdatedJourneyId = response.data.id;
            }
          } else if (response?.id) {
            createdOrUpdatedJourneyId = response.id;
          }

          toast.success(
            isCloneMode
              ? "Journey cloned successfully!"
              : "Journey created successfully!"
          );
        } catch (createError) {
          const error = createError as AxiosError<{
            error: { message: string };
          }>;
          const errorMessage =
            error.response?.data?.error?.message ||
            error.message ||
            "Failed to create journey";
          toast.error(errorMessage);
          return;
        }
      }

      let statusUpdateSuccess = true;

      if (createdOrUpdatedJourneyId) {
        if (data.schedule?.enableImmediateStart === true) {
          try {
            await updateJourneyStatus(createdOrUpdatedJourneyId, "live");
            toast.success("Journey is now live!");
            statusUpdateSuccess = true;
          } catch (statusError) {
            const error = statusError as AxiosError<{
              error: { message: string };
            }>;
            console.error("Error updating journey status to live:", error);
            const errorMessage =
              error.response?.data?.error?.message ||
              error.message ||
              "Failed to set status to live";
            toast.error(errorMessage);
            statusUpdateSuccess = false;
          }
        } else if (data.schedule?.enableScheduledStart === true) {
          try {
            await updateJourneyStatus(createdOrUpdatedJourneyId, "schedule");

            toast.success("Journey is now scheduled!");
            statusUpdateSuccess = true;
          } catch (statusError) {
            const error = statusError as AxiosError<{
              error: { message: string };
            }>;
            console.error("Error updating journey status to scheduled:", error);
            const errorMessage =
              error.response?.data?.error?.message ||
              error.message ||
              "Failed to set status to scheduled";
            toast.error(errorMessage);
            statusUpdateSuccess = false;
          }
        } else {
          statusUpdateSuccess = true;
        }
      } else {
        console.error("No journey ID available for status update");
        statusUpdateSuccess = true;
      }

      if (statusUpdateSuccess) {
        router.push("/dashboard");
      } else {
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ error: { message: string } }>;
      console.error(
        `Error ${journeyId && !isCloneMode ? "updating" : "creating"} journey:`,
        axiosError
      );
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        `Failed to ${
          journeyId && !isCloneMode ? "update" : "create"
        } journey. Please try again.`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const [activeTab, setActiveTab] = useState<"setup" | "ui">("ui");
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [currentEngagementId, setCurrentEngagementId] = useState<string | null>(
    null
  );

  const watchedActions = useWatch({
    control,
    name: "nudgeSelection.actions",
  });

  // Find the first action with a template (not just actions[0])
  const template = useMemo(() => {
    if (!watchedActions || watchedActions.length === 0) return undefined;
    const actionWithTemplate = watchedActions.find((action) => action.template);
    return actionWithTemplate?.template;
  }, [watchedActions]);

  const hasTemplate = useMemo(() => {
    return (
      watchedActions &&
      watchedActions.length > 0 &&
      watchedActions.some((action) => action.template && action.template.type)
    );
  }, [watchedActions]);

  // State to force re-validation check when template is saved
  const [validationKey, setValidationKey] = useState(0);

  // Helper to check if any errors exist in template path for ANY action
  // Use formState.errors which is more reactive to clearErrors
  const hasTemplateErrors = useMemo(() => {
    // Use formState.errors for reactivity, fallback to errors prop
    const currentErrors =
      formState.errors.nudgeSelection?.actions ||
      errors.nudgeSelection?.actions;
    if (!currentErrors) return false;

    // Handle both array and object cases
    const actionsErrors = Array.isArray(currentErrors)
      ? currentErrors
      : currentErrors && typeof currentErrors === "object"
      ? [currentErrors]
      : [];

    if (actionsErrors.length === 0) return false;

    // Check all actions for template errors
    for (let i = 0; i < actionsErrors.length; i++) {
      const actionErrors = actionsErrors[i];
      if (!actionErrors || typeof actionErrors !== "object") continue;

      const templateErrorsPath = (actionErrors as Record<string, unknown>)
        .template;
      if (!templateErrorsPath) continue;

      // Recursively check if any error exists
      const checkForErrors = (obj: unknown): boolean => {
        if (!obj || typeof obj !== "object") return false;
        if ("message" in obj) return true;

        for (const key in obj) {
          if (checkForErrors((obj as Record<string, unknown>)[key]))
            return true;
        }
        return false;
      };

      if (checkForErrors(templateErrorsPath)) return true;
    }

    return false;
  }, [formState.errors, errors, validationKey]);

  // Template is valid if it exists and has no errors
  const isTemplateValid = useMemo(() => {
    const isValid = !!template && !hasTemplateErrors;
    console.log("[CreateJourney] isTemplateValid check:", {
      hasTemplate: !!template,
      templateType: template?.type,
      hasTemplateErrors,
      isTemplateValid: isValid,
    });
    return isValid;
  }, [template, hasTemplateErrors]);

  // Ref to store the sync function from JourneyFlowBuilderIntegrated
  const syncTemplateRef = useRef<(() => void) | null>(null);
  // Ref to check if all engagements have templates
  const checkAllEngagementsHaveTemplatesRef = useRef<(() => boolean) | null>(
    null
  );

  // Note: validationKey is used in hasTemplateErrors useMemo dependency

  // Callback to trigger re-validation when template is saved
  const handleTemplateSaved = async () => {
    // Sync template back to engagement config first
    if (syncTemplateRef.current) {
      syncTemplateRef.current();
    }

    // Clear errors for all action templates
    const currentActions = getValues("nudgeSelection.actions") || [];
    currentActions.forEach((_, index) => {
      clearErrors(
        `nudgeSelection.actions.${index}.template` as Path<
          CreateJourneyFormData
        >
      );
    });

    // Wait a bit for clearErrors to process, then trigger validation
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Trigger form validation for all action templates to ensure errors object is updated
    const actions = getValues("nudgeSelection.actions") || [];
    const validationPromises = actions.map((_, index) =>
      trigger(
        `nudgeSelection.actions.${index}.template` as Path<
          CreateJourneyFormData
        >
      )
    );
    await Promise.all(validationPromises);

    // Force re-check by updating validation key after validation completes
    setValidationKey((prev) => prev + 1);
  };

  const checkUnconnectedNodesRef = useRef<(() => boolean) | null>(null);

  const handleTabChange = async (newTab: "setup" | "ui") => {
    console.log("[CreateJourney] Tab change requested:", newTab);

    // Wait a bit to ensure any pending syncFlowToForm operations complete
    // This is important when nodes are deleted - we need to wait for form data to sync
    // syncFlowToForm runs automatically in useEffect when nodes/edges change
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Check for unconnected nodes/engagements when changing tabs
    if (checkUnconnectedNodesRef.current) {
      const hasUnconnected = checkUnconnectedNodesRef.current();
      if (hasUnconnected) {
        console.log(
          "[CreateJourney] Unconnected nodes found, blocking tab change"
        );
        // Dialog will be shown by JourneyFlowBuilderIntegrated
        // Don't proceed with tab change
        return;
      }
    }

    // Log form state before tab change
    const formDataBeforeTabChange = getValues();
    console.log("[CreateJourney] Form data before tab change:", {
      actionsCount:
        formDataBeforeTabChange.nudgeSelection?.actions?.length || 0,
      actions: formDataBeforeTabChange.nudgeSelection?.actions?.map((a) => ({
        actionId: a.actionId,
        type: a.type,
        onState: a.onState,
        hasTemplate: !!a.template,
        templateType: a.template?.type,
      })),
      eventInfoCount:
        formDataBeforeTabChange.ruleEngine?.eventInfo?.length || 0,
      isTemplateValid,
      hasTemplate,
      hasTemplateErrors,
    });

    // If moving to setup tab, check if all engagement nodes have templates
    if (newTab === "setup") {
      // Check if there are any engagement nodes in the flow
      if (checkAllEngagementsHaveTemplatesRef.current) {
        const allHaveTemplates = checkAllEngagementsHaveTemplatesRef.current();
        if (!allHaveTemplates) {
          toast.error(
            "Please add template details for all engagement nodes before proceeding to Journey Setup."
          );
          return;
        }
      } else {
        // Fallback: check actions in form data if ref is not available
        const currentData = getValues();
        const actions = currentData.nudgeSelection?.actions || [];

        // Check if there are engagements without templates
        const engagementsWithoutTemplates = actions.filter((action) => {
          if (!action.template) return true;

          const template = action.template;
          // Check if template has meaningful content
          const hasContent =
            (template.children && template.children.length > 0) ||
            (template.props && Object.keys(template.props).length > 1) || // More than just testID
            (template.styles && Object.keys(template.styles).length > 0);

          return !hasContent;
        });

        if (engagementsWithoutTemplates.length > 0) {
          toast.error(
            "Please add template details for all engagements before proceeding to Journey Setup."
          );
          return;
        }
      }
    }

    setActiveTab(newTab);
  };
  const handleNext = () => {
    // Check if a template is selected
    const currentData = getValues();
    const hasTemplate =
      currentData.nudgeSelection?.actions &&
      currentData.nudgeSelection.actions.length > 0 &&
      currentData.nudgeSelection.actions.some((action) => action.template);

    if (!hasTemplate) {
      toast.error(
        "Please select and configure an engagement template before proceeding."
      );
      return;
    }

    setActiveTab("setup");
  };
  // Note: isLoading is computed but not used - kept for potential future use
  // const isLoading =
  //   (!eventsData && isFetchingEvents) ||
  //   (!systemPropertiesData && isFetchingSystemProperties);

  if (journeyId && isLoadingJourney) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  console.log("form data", formState);

  return (
    <FormProvider {...methods}>
      <Box sx={createJourneyPageStyles.pageContainer}>
        <JourneyHeader
          control={control}
          errors={errors}
          isEditMode={!!journeyId && !isCloneMode}
        />

        <Box sx={createJourneyPageStyles.mainLayout}>
          <Box sx={createJourneyPageStyles.contentArea}>
            <JourneyTabs activeTab={activeTab} onTabChange={handleTabChange} />
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Box
                sx={{
                  ...createJourneyPageStyles.formContent,
                  height: "calc(100vh - 200px)",
                  minHeight: "600px",
                  display: activeTab === "ui" ? "block" : "none",
                }}
              >
                <JourneyFlowBuilderIntegrated
                  control={control}
                  errors={errors}
                  events={eventsData?.data?.eventList || []}
                  isLoadingEvents={isLoadingEvents || isFetchingEvents}
                  systemPropertyNames={systemPropertyNames}
                  systemPropertyTypes={systemPropertyTypes}
                  onEngagementSelect={(nodeId, engagementId, stateNumber) => {
                    // The integrated component handles the mapping to form actions
                    // Track which engagement is being edited
                    setCurrentEngagementId(engagementId);
                    // Open the side panel for template selection
                    setSidePanelOpen(true);
                  }}
                  syncTemplateRef={syncTemplateRef}
                  checkAllEngagementsHaveTemplatesRef={
                    checkAllEngagementsHaveTemplatesRef
                  }
                  checkUnconnectedNodesRef={checkUnconnectedNodesRef}
                />
              </Box>
              {activeTab === "setup" && (
                <Box sx={createJourneyPageStyles.formContent}>
                  <CohortSection control={control} errors={errors} />
                  <ScheduleSection control={control} errors={errors} />
                  <JourneyFrequencySection control={control} errors={errors} />
                </Box>
              )}

              <EngagementSidePanel
                open={sidePanelOpen}
                onClose={() => {
                  setSidePanelOpen(false);
                  setCurrentEngagementId(null);
                }}
                control={control}
                errors={errors}
                onTemplateSaved={handleTemplateSaved}
                engagementId={currentEngagementId}
              />
              <JourneyActions
                activeTab={activeTab}
                onNext={handleNext}
                isSubmitting={isSubmitting}
                isEditMode={!!journeyId && !isCloneMode}
                isTemplateValid={isTemplateValid}
                hasTemplate={hasTemplate}
              />
            </form>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}
