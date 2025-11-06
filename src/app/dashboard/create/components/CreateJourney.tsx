"use client";

import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useFiltersList } from "@/hooks/useFiltersList";
import { useEventsList } from "@/hooks/useEventsList";
import { useSystemProperties } from "@/hooks/useSystemProperties";
import { useTheme } from "@mui/material/styles";
import { useState, useMemo } from "react";
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

export default function CreateJourneyPage() {
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
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CreateJourneyFormData>({
    defaultValues: {
      ...getJourneyFormDefaults(),
      name: generateRandomJourneyName(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "filters",
  });

  const onFormSubmit = (data: CreateJourneyFormData) => {
    console.log(data);
  };

  const availableProperties = filtersData?.data?.names || [];

  const systemProperties = useMemo(() => {
    if (!systemPropertiesData) {
      return [];
    }

    const data = systemPropertiesData.data;
    if (!data) {
      return [];
    }

    if (Array.isArray(data.names)) {
      return data.names;
    }

    if (Array.isArray(data.properties)) {
      return data.properties;
    }

    if (Array.isArray(data) && data.length > 0 && data[0]?.propertyName) {
      return data.map((item) => item.propertyName).filter(Boolean);
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.systemProperties)) {
      return data.systemProperties;
    }

    if (typeof data === "object" && !Array.isArray(data)) {
      const keys = Object.keys(data);
      if (
        keys.length > 0 &&
        (data as Record<string, any>)[keys[0]]?.propertyName
      ) {
        return keys
          .map((key) => (data as Record<string, any>)[key].propertyName)
          .filter(Boolean);
      }
      return keys;
    }

    return [];
  }, [systemPropertiesData]);
  const [activeTab, setActiveTab] = useState<"setup" | "ui">("setup");

  const handleTabChange = async (newTab: "setup" | "ui") => {
    if (activeTab === "setup" && newTab === "ui") {
      const isValid = await trigger(["name", "event", "filters"]);
      if (isValid) {
        setActiveTab(newTab);
      }
    } else {
      setActiveTab(newTab);
    }
  };

  const handleNext = async () => {
    const isValid = await trigger(["name", "event", "filters"]);
    if (isValid) {
      setActiveTab("ui");
    }
  };

  const isLoading =
    (!eventsData && isFetchingEvents) ||
    (!systemPropertiesData && isFetchingSystemProperties);

  return (
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
                    fields={fields}
                    onAddFilter={() =>
                      append({ property: "", operator: "=", value: "" })
                    }
                    onRemoveFilter={remove}
                    availableProperties={availableProperties}
                    isLoadingFilters={isLoadingFilters}
                    events={eventsData?.data?.eventList || []}
                    isLoadingEvents={isLoadingEvents}
                    systemProperties={systemProperties}
                    isLoading={isLoading}
                  />
                </Box>

                <ScheduleSection control={control} errors={errors} />

                <JourneyFrequencySection control={control} errors={errors} />
              </Box>
            )}

            {activeTab === "ui" && (
              <Box sx={createJourneyPageStyles.formContent}>
                <Box sx={createJourneyPageStyles.formCard(theme)}>
                  <Typography
                    variant="subtitle2"
                    sx={createJourneyPageStyles.sectionLabel}
                  >
                    {JOURNEY_TEXT.SECTIONS.UI_CONTENT.TITLE}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    {JOURNEY_TEXT.SECTIONS.UI_CONTENT.DESCRIPTION}
                  </Typography>
                </Box>
              </Box>
            )}

            <JourneyActions activeTab={activeTab} onNext={handleNext} />
          </form>
        </Box>
      </Box>
    </Box>
  );
}
