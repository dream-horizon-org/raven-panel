"use client";

import { Box, CircularProgress } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useEventsList } from "@/app/dashboard/create/hooks/useEventsList";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createJourneyPageStyles } from "./content/styles/createJourneyPageStyles";
import {
  generateRandomJourneyName,
  findMatchingEvent,
  createEventSelection,
} from "../utils/journey.utils";
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
import { getJourneyById } from "@/api/services/getJourney.service";
import { toast } from "sonner";
import { parseJourneyDataToFormData } from "../utils/parseJourneyData.utils";
import { useWatch, Path } from "react-hook-form";
import { submitJourney } from "../utils/journeySubmission.utils";
import {
  hasTemplateErrors as checkTemplateErrors,
  hasTemplate as checkHasTemplate,
  validateEngagementsBeforeTabChange,
} from "../utils/templateValidation.utils";
import { extractAllTemplateVariables } from "../utils/extractTemplateVariables.utils";

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

  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    isFetching: isFetchingEvents,
  } = useEventsList();

  const systemPropertyNames: string[] = [];
  const systemPropertyTypes = new Map<string, string>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingJourney, setIsLoadingJourney] = useState(false);
  const hasFetchedJourneyRef = useRef<string | undefined>(undefined);
  const [validationKey, setValidationKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"setup" | "ui">("ui");
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [currentEngagementId, setCurrentEngagementId] = useState<string | null>(
    null
  );

  const watchedActions = useWatch({
    control,
    name: "nudgeSelection.actions",
  });

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

  // Auto-sync template variables to contextParams
  useEffect(() => {
    if (!watchedActions || watchedActions.length === 0) {
      // If no actions, clear auto-added contextParams
      // For now, we'll keep existing contextParams when no actions exist
      return;
    }
    
    // Extract all template variables from all actions
    const templateVariables = extractAllTemplateVariables(watchedActions);
    
    // Get current contextParams
    const currentContextParams = getValues("contextParams") || [];
    const templateVariableSet = new Set(templateVariables);
    
    // Filter contextParams to only keep those that are still in templates
    // This removes variables that are no longer used
    const updatedContextParams = currentContextParams.filter(
      (param: { id: number; label: string }) => templateVariableSet.has(param.label)
    );
    
    // Find which template variables are missing from the filtered contextParams
    const existingLabels = new Set(
      updatedContextParams.map((param: { id: number; label: string }) => param.label)
    );
    const missingVariables = Array.from(templateVariables).filter(
      (variable) => !existingLabels.has(variable)
    );

    // Add missing variables or update if contextParams changed
    if (missingVariables.length > 0 || updatedContextParams.length !== currentContextParams.length) {
      const newContextParams = [
        ...updatedContextParams,
        ...missingVariables.map((variable, index) => ({
          id: Date.now() + index,
          label: variable,
        })),
      ];

      setValue("contextParams", newContextParams, { shouldDirty: true });
    }
  }, [watchedActions, getValues, setValue]);

  useEffect(() => {
    const fetchJourneyData = async () => {
      if (!journeyId || hasFetchedJourneyRef.current === journeyId) return;

      try {
        setIsLoadingJourney(true);
        hasFetchedJourneyRef.current = journeyId;
        const journeyResponse = await getJourneyById(Number(journeyId));

        const formData = parseJourneyDataToFormData(journeyResponse);
        if (
          formData.ruleEngine.currentDropdownSelectedEvent &&
          eventsData?.data?.eventList &&
          eventsData.data.eventList.length > 0
        ) {
          const eventName =
            formData.ruleEngine.currentDropdownSelectedEvent.label;
          const matchingEvent = findMatchingEvent(
            eventName,
            eventsData.data.eventList
          );
          if (matchingEvent) {
            formData.ruleEngine.currentDropdownSelectedEvent = createEventSelection(
              matchingEvent,
              eventsData.data.eventList,
              eventName
            );
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
  }, [journeyId, isCloneMode, eventsData]);

  useEffect(() => {
    if (
      journeyId &&
      !isLoadingJourney &&
      eventsData?.data?.eventList &&
      eventsData.data.eventList.length > 0
    ) {
      const currentEvent = getValues("ruleEngine.currentDropdownSelectedEvent");
      if (currentEvent?.label && (currentEvent.id === 0 || !currentEvent.id)) {
        const matchingEvent = findMatchingEvent(
          currentEvent.label,
          eventsData.data.eventList
        );
        if (matchingEvent) {
          setValue(
            "ruleEngine.currentDropdownSelectedEvent",
            createEventSelection(
              matchingEvent,
              eventsData.data.eventList,
              currentEvent.label
            )
          );
        }
      }
    }
  }, [journeyId, isLoadingJourney, eventsData, setValue, getValues]);

  const onFormSubmit = async (data: CreateJourneyFormData) => {
    await submitJourney({
      data,
      errors,
      setError,
      clearErrors,
      journeyId,
      isCloneMode,
      searchParams,
      setIsSubmitting,
      onSuccess: (statusParam) => {
        const params = new URLSearchParams();
        if (statusParam) {
          params.set("status", statusParam);
        }
        const queryString = params.toString();
        router.push(`/dashboard${queryString ? `?${queryString}` : ""}`);
      },
    });
  };

  const template = useMemo(() => {
    if (!watchedActions || watchedActions.length === 0) return undefined;
    const actionWithTemplate = watchedActions.find((action) => action.template);
    return actionWithTemplate?.template;
  }, [watchedActions]);

  const hasTemplate = useMemo(() => checkHasTemplate(watchedActions), [
    watchedActions,
  ]);

  const hasTemplateErrors = useMemo(
    () =>
      checkTemplateErrors({
        formStateErrors: formState.errors,
        errors,
      }),
    [formState.errors, errors, validationKey]
  );

  const isTemplateValid = useMemo(() => {
    const isValid = !!template && !hasTemplateErrors;
    return isValid;
  }, [template, hasTemplateErrors]);

  const syncTemplateRef = useRef<(() => void) | null>(null);
  const checkAllEngagementsHaveTemplatesRef = useRef<(() => boolean) | null>(
    null
  );

  const handleTemplateSaved = async () => {
    if (syncTemplateRef.current) {
      syncTemplateRef.current();
    }

    const currentActions = getValues("nudgeSelection.actions") || [];
    currentActions.forEach((_, index) => {
      clearErrors(
        `nudgeSelection.actions.${index}.template` as Path<
          CreateJourneyFormData
        >
      );
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const actions = getValues("nudgeSelection.actions") || [];
    const validationPromises = actions.map((_, index) =>
      trigger(
        `nudgeSelection.actions.${index}.template` as Path<
          CreateJourneyFormData
        >
      )
    );
    await Promise.all(validationPromises);

    setValidationKey((prev) => prev + 1);
  };

  const checkUnconnectedNodesRef = useRef<(() => boolean) | null>(null);

  const handleTabChange = async (newTab: "setup" | "ui") => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (checkUnconnectedNodesRef.current) {
      const hasUnconnected = checkUnconnectedNodesRef.current();
      if (hasUnconnected) {
        return;
      }
    }

    if (newTab === "setup") {
      if (checkAllEngagementsHaveTemplatesRef.current) {
        const allHaveTemplates = checkAllEngagementsHaveTemplatesRef.current();
        if (!allHaveTemplates) {
          toast.error(
            "Please add template details for all engagement nodes before proceeding to Journey Setup."
          );
          return;
        }
      } else {
        const currentData = getValues();
        const actions = currentData.nudgeSelection?.actions || [];

        const validation = validateEngagementsBeforeTabChange(actions);
        if (!validation.isValid) {
          toast.error(validation.message || "");
          return;
        }
      }
    }

    setActiveTab(newTab);
  };

  const handleNext = () => {
    const currentData = getValues();
    const hasTemplate = checkHasTemplate(currentData.nudgeSelection?.actions);

    if (!hasTemplate) {
      toast.error(
        "Please select and configure an engagement template before proceeding."
      );
      return;
    }

    setActiveTab("setup");
  };

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

  return (
    <FormProvider {...methods}>
      <Box sx={createJourneyPageStyles.pageContainer}>
        <JourneyHeader
          control={control}
          errors={errors}
          isEditMode={!!journeyId && !isCloneMode}
          hasTemplate={hasTemplate}
        />

        <Box sx={createJourneyPageStyles.mainLayout}>
          <Box sx={createJourneyPageStyles.contentArea}>
            <JourneyTabs activeTab={activeTab} onTabChange={handleTabChange} />
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                overflow: "hidden",
                minHeight: 0,
              }}
            >
              <Box
                sx={{
                  ...createJourneyPageStyles.formContent,
                  flex: 1,
                  display: activeTab === "ui" ? "flex" : "none",
                  flexDirection: "column",
                  overflow: "hidden",
                  minHeight: 0,
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
                    setCurrentEngagementId(engagementId);
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
                <Box
                  sx={{
                    ...createJourneyPageStyles.formContent,
                    flex: 1,
                    overflow: "auto",
                    minHeight: 0,
                  }}
                >
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
                isCloneMode={isCloneMode}
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
