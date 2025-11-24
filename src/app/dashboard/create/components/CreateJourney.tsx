"use client";

import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useEventsList } from "@/hooks/useEventsList";
import { useFiltersList } from "@/hooks/useFiltersList";
import { useSystemProperties } from "@/hooks/useSystemProperties";
import { useTheme } from "@mui/material/styles";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createJourneyPageStyles } from "../styles/createJourneyPageStyles";
import { generateRandomJourneyName } from "../utils/journeyUtils";
import { CreateJourneyFormData } from "../types/journeyTypes";
import {
  JOURNEY_TEXT,
  getJourneyFormDefaults,
} from "../constants/journeyConstants";
import JourneyHeader from "./JourneyHeader";
import JourneyTabs from "./JourneyTabs";
import CohortSection from "./CohortSection";
import EventTriggerSection from "./EventTriggerSection";
import ScheduleSection from "./ScheduleSection";
import JourneyFrequencySection from "./JourneyFrequencySection";
import JourneyActions from "./JourneyActions";
import EngagementSelector from "./EngagementSelector";
import EngagementSidePanel from "./EngagementSidePanel";
import { createJourney } from "@/api/services/createJourney.service";
import { updateJourney } from "@/api/services/updateJourney.service";
import { getJourneyById } from "@/api/services/getJourney.service";
import { toast } from "sonner";
import { parseJourneyDataToFormData } from "../utils/parseJourneyData";
import { useWatch } from "react-hook-form";
import { validateTemplate } from "../utils/validation";

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
  const theme = useTheme();
  const { data: filtersData, isLoading: isLoadingFilters } = useFiltersList();
  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    isFetching: isFetchingEvents,
  } = useEventsList();
  const {
    data: systemPropertiesData,
    isLoading: isLoadingSystemProperties,
    isFetching: isFetchingSystemProperties,
  } = useSystemProperties();
  const availableProperties = filtersData?.data?.names || [];
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
        },
      },
    }
  );

  // Watch journey frequency checkboxes to clear error when any is checked
  const enableTimesInSession = useWatch({
    control: methods.control,
    name: "journeyFrequency.enableTimesInSession",
  });
  const enableMaxTimesInPeriod = useWatch({
    control: methods.control,
    name: "journeyFrequency.enableMaxTimesInPeriod",
  });
  const enableMaxTimesInLifetime = useWatch({
    control: methods.control,
    name: "journeyFrequency.enableMaxTimesInLifetime",
  });
  const {
    control,
    handleSubmit,
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
  const [showMultipleEventDialog, setShowMultipleEventDialog] = useState(false);
  const hasFetchedJourneyRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const fetchJourneyData = async () => {
      if (!journeyId || hasFetchedJourneyRef.current === journeyId) return;

      try {
        setIsLoadingJourney(true);
        hasFetchedJourneyRef.current = journeyId;
        const journeyResponse = await getJourneyById(Number(journeyId));

        // Check if journey has multiple events in stateTransition
        const stateTransition = journeyResponse?.data?.rule?.stateTransition;
        if (stateTransition && typeof stateTransition === "object") {
          const eventCount = Object.keys(stateTransition).length;
          if (eventCount > 1) {
            setShowMultipleEventDialog(true);
            setIsLoadingJourney(false);
            return;
          }
        }

        const formData = parseJourneyDataToFormData(journeyResponse);
        reset(formData);
        toast.success(
          isCloneMode
            ? "Journey data loaded for cloning"
            : "Journey data loaded successfully"
        );
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
  }, [journeyId, isCloneMode]);

  useEffect(() => {
    if (
      journeyId &&
      !isLoadingJourney &&
      eventsData?.data?.eventList &&
      eventsData.data.eventList.length > 0
    ) {
      const currentEvent = getValues("ruleEngine.currentDropdownSelectedEvent");
      if (currentEvent?.label) {
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

  useEffect(() => {
    const fetchJourneyData = async () => {
      if (!journeyId) return;
      try {
        setIsLoadingJourney(true);
        const journeyResponse = await getJourneyById(Number(journeyId));
        const formData = parseJourneyDataToFormData(journeyResponse);
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
        toast.success("Journey data loaded successfully");
      } catch (error) {
        console.error("Error fetching journey data:", error);
        toast.error("Failed to load journey data. Please try again.");
      } finally {
        setIsLoadingJourney(false);
      }
    };
    if (journeyId) {
      fetchJourneyData();
    }
  }, [journeyId, reset, setValue]);

  useEffect(() => {
    if (
      journeyId &&
      eventsData?.data?.eventList &&
      eventsData.data.eventList.length > 0
    ) {
      const currentEvent = getValues("ruleEngine.currentDropdownSelectedEvent");
      if (currentEvent?.label && currentEvent.id === 0) {
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
  }, [journeyId, eventsData, setValue, getValues]);
  const onFormSubmit = async (data: CreateJourneyFormData) => {
    console.log("data", data);
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
        const basePath = `nudgeSelection.actions.${i}.template` as any;
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
      if (journeyId && !isCloneMode) {
        const response = await updateJourney(Number(journeyId), data);
        toast.success("Journey updated successfully!");
        router.push("/dashboard");
      } else {
        const response = await createJourney(data);
        toast.success(
          isCloneMode
            ? "Journey cloned successfully!"
            : "Journey created successfully!"
        );
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(
        `Error ${journeyId && !isCloneMode ? "updating" : "creating"} journey:`,
        error
      );
      toast.error(
        `Failed to ${
          journeyId && !isCloneMode ? "update" : "create"
        } journey. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const [activeTab, setActiveTab] = useState<"setup" | "ui">("setup");
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  // Watch template to check validation
  const template = useWatch({
    control,
    name: "nudgeSelection.actions.0.template",
  });

  // State to force re-validation check when template is saved
  const [validationKey, setValidationKey] = useState(0);

  // Helper to check if any errors exist in template path
  const hasTemplateErrors = useMemo(() => {
    const templateErrorsPath = errors.nudgeSelection?.actions?.[0]?.template;
    if (!templateErrorsPath) return false;

    // Recursively check if any error exists
    const checkForErrors = (obj: any): boolean => {
      if (!obj || typeof obj !== "object") return false;
      if ("message" in obj) return true;

      for (const key in obj) {
        if (checkForErrors(obj[key])) return true;
      }
      return false;
    };

    return checkForErrors(templateErrorsPath);
  }, [errors, template, validationKey]);

  // Template is valid if it exists and has no errors
  const isTemplateValid = !!template && !hasTemplateErrors;

  // Callback to trigger re-validation when template is saved
  const handleTemplateSaved = () => {
    // Force re-check by updating validation key
    setValidationKey((prev) => prev + 1);
    // Also trigger form validation to ensure errors object is updated
    setTimeout(() => {
      trigger("nudgeSelection.actions.0.template" as any);
    }, 0);
  };

  const handleTabChange = async (newTab: "setup" | "ui") => {
    if (activeTab === "setup" && newTab === "ui") {
      const isValid = await trigger([
        "ctaMetadata.ctaTitle",
        "ruleEngine.currentDropdownSelectedEvent",
      ]);
      if (isValid) {
        setActiveTab(newTab);
      }
    } else {
      setActiveTab(newTab);
    }
  };
  const handleNext = () => {
    setActiveTab("ui");
  };
  const isLoading =
    (!eventsData && isFetchingEvents) ||
    (!systemPropertiesData && isFetchingSystemProperties);

  const handleCloseMultipleEventDialog = () => {
    setShowMultipleEventDialog(false);
    router.push("/dashboard");
  };

  const handleGoToRTNPanel = () => {
    window.open(
      "https://msd.dream11.com/e1847819ec7438d48900dac635b5cb40/d11-configurability/d11-configurabilityPage",
      "_blank"
    );
    setShowMultipleEventDialog(false);
    router.push("/dashboard");
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
      <Dialog
        open={showMultipleEventDialog}
        onClose={handleCloseMultipleEventDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Multiple Event Journey Not Supported</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Multiple event journeys are not supported through this panel right
            now. Please use the{" "}
            <a
              href="https://msd.dream11.com/e1847819ec7438d48900dac635b5cb40/d11-configurability/d11-configurabilityPage"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.palette.primary.main,
                textDecoration: "underline",
              }}
            >
              RTN MSD
            </a>{" "}
            panel for this.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMultipleEventDialog}>Close</Button>
          <Button
            onClick={handleGoToRTNPanel}
            variant="contained"
            color="primary"
          >
            Go to RTN Panel
          </Button>
        </DialogActions>
      </Dialog>

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
              {activeTab === "setup" && (
                <Box sx={createJourneyPageStyles.formContent}>
                  <CohortSection control={control} errors={errors} />
                  <Box sx={createJourneyPageStyles.filtersSection}>
                    <EventTriggerSection
                      control={control}
                      errors={errors}
                      events={eventsData?.data?.eventList || []}
                      isLoadingEvents={isLoadingEvents}
                      isLoading={isLoading}
                      availableProperties={availableProperties}
                      isLoadingFilters={isLoadingFilters}
                      systemProperties={systemPropertyNames}
                      systemPropertyTypes={systemPropertyTypes}
                    />
                  </Box>
                  <ScheduleSection control={control} errors={errors} />
                  <JourneyFrequencySection control={control} errors={errors} />
                </Box>
              )}
              {activeTab === "ui" && (
                <Box sx={createJourneyPageStyles.formContent}>
                  <EngagementSelector
                    control={control}
                    errors={errors}
                    onEngagementSelect={() => setSidePanelOpen(true)}
                  />
                </Box>
              )}
              <EngagementSidePanel
                open={sidePanelOpen}
                onClose={() => setSidePanelOpen(false)}
                control={control}
                errors={errors}
                onTemplateSaved={handleTemplateSaved}
              />
              <JourneyActions
                activeTab={activeTab}
                onNext={handleNext}
                isSubmitting={isSubmitting}
                isEditMode={!!journeyId && !isCloneMode}
                isTemplateValid={isTemplateValid}
              />
            </form>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}
