"use client";

import { Box, Typography } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useEventsList } from "@/hooks/useEventsList";
import { useFiltersList } from "@/hooks/useFiltersList";
import { useSystemProperties } from "@/hooks/useSystemProperties";
import { useTheme } from "@mui/material/styles";
import { useState, useMemo, useEffect } from "react";
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

interface CreateJourneyPageProps {
  journeyId?: string;
}

export default function CreateJourneyPage({
  journeyId: journeyIdProp,
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    setValue,
    getValues,
  } = methods;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingJourney, setIsLoadingJourney] = useState(false);

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

    try {
      setIsSubmitting(true);
      if (journeyId) {
        const response = await updateJourney(Number(journeyId), data);
        console.log("Journey updated successfully:", response);
        toast.success("Journey updated successfully!");
        router.push("/dashboard");
      } else {
        const response = await createJourney(data);
        console.log("Journey created successfully:", response);
        toast.success("Journey created successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(
        `Error ${journeyId ? "updating" : "creating"} journey:`,
        error
      );
      toast.error(
        `Failed to ${
          journeyId ? "update" : "create"
        } journey. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const [activeTab, setActiveTab] = useState<"setup" | "ui">("setup");
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

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

  return (
    <FormProvider {...methods}>
      <Box sx={createJourneyPageStyles.pageContainer}>
        <JourneyHeader control={control} errors={errors} />

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
              />

              <JourneyActions
                activeTab={activeTab}
                onNext={handleNext}
                isSubmitting={isSubmitting}
                isEditMode={!!journeyId}
              />
            </form>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}
