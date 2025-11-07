"use client";

import { Box, Typography } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useFiltersList } from "@/hooks/useFiltersList";
import { useEventsList } from "@/hooks/useEventsList";
import { useSystemProperties } from "@/hooks/useSystemProperties";
import { useTheme } from "@mui/material/styles";
import { useState, useMemo, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { createJourneyPageStyles } from "../styles/createJourneyPageStyles";
import { generateRandomJourneyName } from "../utils/journeyUtils";
import {
  CreateJourneyFormData,
  ConditionData,
  Comparison,
  PropertyType,
} from "../types/journeyTypes";
import {
  convertComparisonValue,
  isNumericType,
  normalizePropertyType,
} from "../utils/propertyTypeUtils";
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
  const methods = useForm<CreateJourneyFormData>({
    defaultValues: {
      ...getJourneyFormDefaults(),
      name: generateRandomJourneyName(),
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = methods;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "condition.comparisons",
  });

  const conditionOperator = useWatch({
    control,
    name: "condition.operator",
  });

  useEffect(() => {
    // Only initialize once on mount if field array is empty
    if (fields.length === 0) {
      const condition =
        control._formValues.condition || getJourneyFormDefaults().condition;
      if (condition.comparisons.length > 0) {
        replace(condition.comparisons);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const availableProperties = filtersData?.data?.names || [];

  // Extract system properties and their types
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

    // Handle array of objects with propertyName and type
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item?.propertyName) {
          names.push(item.propertyName);
          if (item.type) {
            // Normalize type (e.g., "Long" -> "long")
            const normalizedType = item.type.toLowerCase();
            types.set(item.propertyName, normalizedType);
          }
        }
      });
    } else if (Array.isArray(data.names)) {
      // Fallback: if it's just names array
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

  // Build propertyTypeMap to get correct types for transformation
  const selectedEventName = useWatch({ control, name: "event" });
  const propertyTypeMap = useMemo(() => {
    const typeMap = new Map<string, string>();

    // Add event properties with their types
    if (selectedEventName && eventsData?.data?.eventList) {
      const selectedEvent = eventsData.data.eventList.find(
        (e) => e.metadata.eventName === selectedEventName
      );
      if (selectedEvent?.properties) {
        selectedEvent.properties.forEach((prop) => {
          typeMap.set(prop.propertyName, prop.type || "string");
        });
      }
    }

    // Add system properties with their types (from API response)
    systemPropertyNames.forEach((propName) => {
      if (!typeMap.has(propName)) {
        // Use type from system properties if available, otherwise default to "string"
        const systemType = systemPropertyTypes.get(propName);
        typeMap.set(propName, systemType || "string");
      }
    });

    return typeMap;
  }, [eventsData, systemPropertyNames, systemPropertyTypes, selectedEventName]);

  // Transform comparisons: normalize propertyType and convert comparisonValue
  const transformComparisons = (comparisons: Comparison[]): Comparison[] => {
    return comparisons.map((comparison) => {
      // Always try to get propertyType from propertyTypeMap first (source of truth)
      // Fallback to form value if not in map
      let propertyTypeStr: string;
      if (
        comparison.propertyName &&
        propertyTypeMap.has(comparison.propertyName)
      ) {
        propertyTypeStr = propertyTypeMap.get(comparison.propertyName)!;
      } else {
        propertyTypeStr = String(comparison.propertyType);
      }

      const normalizedType = normalizePropertyType(propertyTypeStr);
      const isNumeric = isNumericType(propertyTypeStr);
      return {
        propertyName: comparison.propertyName,
        propertyType: normalizedType,
        comparisonType: comparison.comparisonType,
        comparisonValue: isNumeric
          ? convertComparisonValue(comparison.comparisonValue, propertyTypeStr)
          : comparison.comparisonValue,
      };
    });
  };

  const syncCondition = (
    comparisons: Comparison[],
    operator: "AND" | "OR" = conditionOperator || "AND"
  ) => {
    const transformedComparisons = transformComparisons(comparisons);
    setValue("condition", {
      operator,
      comparisons: transformedComparisons,
    });
  };

  const onFormSubmit = (data: CreateJourneyFormData) => {
    const transformedCondition: ConditionData = {
      operator: data.condition.operator,
      comparisons: transformComparisons(data.condition.comparisons),
    };

    const transformedData = {
      ...data,
      condition: JSON.stringify(transformedCondition),
    };
    console.log(transformedData);
  };

  const [activeTab, setActiveTab] = useState<"setup" | "ui">("setup");

  const handleTabChange = async (newTab: "setup" | "ui") => {
    if (activeTab === "setup" && newTab === "ui") {
      const currentComparisons =
        control._formValues.condition?.comparisons || [];
      syncCondition(currentComparisons, conditionOperator || "AND");
      const isValid = await trigger(["name", "event", "condition"]);
      if (isValid) {
        setActiveTab(newTab);
      }
    } else {
      setActiveTab(newTab);
    }
  };

  const handleNext = async () => {
    const currentComparisons = control._formValues.condition?.comparisons || [];
    syncCondition(currentComparisons, conditionOperator || "AND");
    const isValid = await trigger(["name", "event", "condition"]);
    if (isValid) {
      setActiveTab("ui");
    }
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
                      fields={fields}
                      onAddFilter={() => {
                        const newComparison: Comparison = {
                          propertyName: "",
                          propertyType: "string",
                          comparisonType: "=",
                          comparisonValue: "",
                        };
                        append(newComparison);
                        // syncCondition will be called automatically when form values change
                        // No need to manually sync here as it will use the current form state
                      }}
                      onOperatorChange={(operator: "AND" | "OR") => {
                        setValue("condition.operator", operator);
                        const currentComparisons =
                          control._formValues.condition?.comparisons || [];
                        syncCondition(currentComparisons, operator);
                      }}
                      operator={conditionOperator || "AND"}
                      onRemoveFilter={(index: number) => {
                        remove(index);
                        // syncCondition will be called automatically when form values change
                        // No need to manually sync here
                      }}
                      availableProperties={availableProperties}
                      isLoadingFilters={isLoadingFilters}
                      events={eventsData?.data?.eventList || []}
                      isLoadingEvents={isLoadingEvents}
                      systemProperties={systemPropertyNames}
                      systemPropertyTypes={systemPropertyTypes}
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
    </FormProvider>
  );
}
