"use client";

import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Tooltip,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Controller,
  FieldValues,
  useWatch,
  useFieldArray,
  useFormContext,
  Path,
  FieldArrayPath,
} from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import { useState, useMemo, useEffect } from "react";
import { eventTriggerSectionStyles } from "../styles/eventTriggerSectionStyles";
import {
  CreateJourneyFormData,
  Filter,
  EventInfo,
  OperatorType,
} from "../types/journeyTypes";
import {
  JOURNEY_TEXT,
  OPERATOR_TYPES,
  OPERATORS,
} from "../constants/journeyConstants";
import FilterRow from "./FilterRow";

interface EventTriggerSectionProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  events: Array<{
    metadata: { eventName: string };
    properties: Array<{ propertyName: string; type: string }>;
  }>;
  isLoadingEvents: boolean;
  isLoading: boolean;
  availableProperties: string[];
  isLoadingFilters: boolean;
  systemProperties: string[];
  systemPropertyTypes: Map<string, string>;
}

export default function EventTriggerSection({
  control,
  errors,
  events,
  isLoadingEvents,
  isLoading,
  availableProperties,
  isLoadingFilters,
  systemProperties,
  systemPropertyTypes,
}: EventTriggerSectionProps) {
  const theme = useTheme();
  const { setValue } = useFormContext<CreateJourneyFormData>();
  const [searchTerm, setSearchTerm] = useState("");

  const selectedEvent = useWatch({
    control,
    name: "ruleEngine.currentDropdownSelectedEvent",
  });

  const eventInfo = useWatch({
    control,
    name: "ruleEngine.eventInfo",
  });

  // Find the selected event's EventInfo index, create if doesn't exist
  const selectedEventIndex = useMemo(() => {
    if (!selectedEvent?.label || !eventInfo) return -1;
    const index = eventInfo.findIndex(
      (e) => e?.eventname === selectedEvent.label
    );
    return index;
  }, [selectedEvent, eventInfo]);

  // Clean up incomplete EventInfo entries on mount
  useEffect(() => {
    const currentEventInfo = control._formValues.ruleEngine?.eventInfo || [];
    const cleanedEventInfo = currentEventInfo.filter(
      (e: EventInfo | unknown): e is EventInfo =>
        !!e &&
        typeof e === "object" &&
        "eventname" in e &&
        "currentState" in e &&
        Array.isArray((e as EventInfo).currentState) &&
        (e as EventInfo).currentState.length > 0
    );

    if (cleanedEventInfo.length !== currentEventInfo.length) {
      setValue("ruleEngine.eventInfo", cleanedEventInfo);
    }
  }, []); // Only run once on mount

  // Ensure EventInfo exists for selected event
  useEffect(() => {
    if (selectedEvent?.label && selectedEventIndex < 0) {
      const currentEventInfo = control._formValues.ruleEngine?.eventInfo || [];

      // Remove any incomplete entries (missing eventname or invalid structure)
      const cleanedEventInfo = currentEventInfo.filter(
        (e: EventInfo | unknown): e is EventInfo =>
          !!e &&
          typeof e === "object" &&
          "eventname" in e &&
          "currentState" in e &&
          Array.isArray((e as EventInfo).currentState) &&
          (e as EventInfo).currentState.length > 0
      );

      // Create new EventInfo entry with default structure
      const newEventInfo = {
        eventname: selectedEvent.label,
        currentState: [
          {
            currentState: 0,
            nextState: [
              {
                transitionTo: 1,
                filters: {
                  operator: "AND" as const,
                  filter: [],
                },
              },
            ],
          },
        ],
      };

      setValue("ruleEngine.eventInfo", [...cleanedEventInfo, newEventInfo]);
    }
  }, [selectedEvent, selectedEventIndex, setValue, control]);

  // Use the found index or calculate the correct index
  const filterEventIndex = useMemo(() => {
    if (selectedEventIndex >= 0) {
      return selectedEventIndex;
    }
    // If not found yet, use the last index (will be updated when EventInfo is created)
    const currentEventInfo = control._formValues.ruleEngine?.eventInfo || [];
    const cleanedEventInfo = currentEventInfo.filter(
      (e: EventInfo | unknown): e is EventInfo =>
        !!e &&
        typeof e === "object" &&
        "eventname" in e &&
        !!(e as EventInfo).eventname
    );
    return cleanedEventInfo.length > 0 ? cleanedEventInfo.length - 1 : 0;
  }, [selectedEventIndex, control]);

  // Use the first currentState's first nextState's filters
  const filterPath = useMemo(
    () =>
      `ruleEngine.eventInfo.${filterEventIndex}.currentState.0.nextState.0.filters` as const,
    [filterEventIndex]
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${filterPath}.filter` as FieldArrayPath<CreateJourneyFormData>,
  });

  const conditionOperator = useWatch({
    control,
    name: `${filterPath}.operator` as Path<CreateJourneyFormData>,
  });

  const { combinedProperties, propertyTypeMap } = useMemo(() => {
    const eventProperties: string[] = [];
    const typeMap = new Map<string, string>();

    if (selectedEvent && selectedEvent.label && events) {
      const selectedEventObj = events.find(
        (e) => e.metadata.eventName === selectedEvent.label
      );
      if (selectedEventObj?.properties) {
        selectedEventObj.properties.forEach((prop) => {
          eventProperties.push(prop.propertyName);
          typeMap.set(prop.propertyName, prop.type || "string");
        });
      }
    }

    systemProperties.forEach((propName) => {
      if (!typeMap.has(propName)) {
        const systemType = systemPropertyTypes.get(propName);
        typeMap.set(propName, systemType || "string");
      }
    });

    const allProperties = [...eventProperties, ...(systemProperties || [])];
    const uniqueProperties = Array.from(new Set(allProperties)).sort();

    return {
      combinedProperties: uniqueProperties,
      propertyTypeMap: typeMap,
    };
  }, [selectedEvent, events, systemProperties, systemPropertyTypes]);

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const filtered = events.filter((event) =>
      event.metadata.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return searchTerm ? filtered : filtered.slice(0, 10);
  }, [events, searchTerm]);

  return (
    <Box sx={eventTriggerSectionStyles.filtersCard(theme)}>
      <Box sx={eventTriggerSectionStyles.fieldHeader}>
        <Box sx={eventTriggerSectionStyles.fieldHeaderContent}>
          <EventAvailableIcon sx={eventTriggerSectionStyles.fieldHeaderIcon} />
          <Typography sx={eventTriggerSectionStyles.fieldLabel(theme)}>
            {JOURNEY_TEXT.SECTIONS.EVENT_TRIGGER.TITLE}
          </Typography>
          <Tooltip
            title={JOURNEY_TEXT.SECTIONS.EVENT_TRIGGER.TOOLTIP}
            placement="top"
          >
            <HelpOutlineIcon sx={eventTriggerSectionStyles.fieldInfoIcon} />
          </Tooltip>
        </Box>
        <Typography sx={eventTriggerSectionStyles.fieldSubtext}>
          {JOURNEY_TEXT.SECTIONS.EVENT_TRIGGER.DESCRIPTION}
        </Typography>
      </Box>

      <Box sx={eventTriggerSectionStyles.formSection}>
        <Box sx={eventTriggerSectionStyles.eventFieldContainer}>
          <Controller
            name="ruleEngine.currentDropdownSelectedEvent"
            control={control}
            // rules={{ required: JOURNEY_TEXT.VALIDATION.EVENT_REQUIRED }}
            render={({ field }: { field: FieldValues }) => (
              <Box sx={eventTriggerSectionStyles.eventField}>
                <Autocomplete
                  options={filteredEvents}
                  getOptionLabel={(option) => option.metadata.eventName}
                  isOptionEqualToValue={(option, value) => {
                    if (
                      !value ||
                      typeof value !== "object" ||
                      !("label" in value)
                    ) {
                      return false;
                    }
                    return (
                      option.metadata.eventName ===
                      (value as { label: string }).label
                    );
                  }}
                  loading={isLoading}
                  onInputChange={(_, newInputValue) => {
                    setSearchTerm(newInputValue);
                  }}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      const eventName = newValue.metadata.eventName;
                      field.onChange({
                        id: events.indexOf(newValue) + 1,
                        label: eventName,
                      });

                      // Ensure EventInfo exists for this event with default structure
                      const currentEventInfo =
                        control._formValues.ruleEngine?.eventInfo || [];

                      // Remove any incomplete entries (missing eventname)
                      const cleanedEventInfo = currentEventInfo.filter(
                        (e: EventInfo | unknown): e is EventInfo =>
                          !!e &&
                          typeof e === "object" &&
                          "eventname" in e &&
                          !!(e as EventInfo).eventname
                      );

                      const eventInfoIndex = cleanedEventInfo.findIndex(
                        (e: EventInfo) => e.eventname === eventName
                      );

                      if (eventInfoIndex < 0) {
                        // Create new EventInfo entry with default structure
                        const newEventInfo = {
                          eventname: eventName,
                          currentState: [
                            {
                              currentState: 0,
                              nextState: [
                                {
                                  transitionTo: 1,
                                  filters: {
                                    operator: "AND" as const,
                                    filter: [],
                                  },
                                },
                              ],
                            },
                          ],
                        };
                        setValue("ruleEngine.eventInfo", [
                          ...cleanedEventInfo,
                          newEventInfo,
                        ]);
                      } else {
                        // Update existing entry to ensure it has proper structure
                        const existingEntry = cleanedEventInfo[eventInfoIndex];
                        if (
                          !existingEntry.currentState ||
                          existingEntry.currentState.length === 0
                        ) {
                          cleanedEventInfo[eventInfoIndex] = {
                            ...existingEntry,
                            currentState: [
                              {
                                currentState: 0,
                                nextState: [
                                  {
                                    transitionTo: 1,
                                    filters: {
                                      operator: "AND" as const,
                                      filter:
                                        existingEntry.currentState?.[0]
                                          ?.nextState?.[0]?.filters?.filter ||
                                        [],
                                    },
                                  },
                                ],
                              },
                            ],
                          };
                          setValue("ruleEngine.eventInfo", cleanedEventInfo);
                        }
                      }
                    } else {
                      field.onChange(null);
                    }
                  }}
                  value={
                    selectedEvent && selectedEvent.label
                      ? events.find(
                          (e) => e.metadata.eventName === selectedEvent.label
                        ) || null
                      : null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={JOURNEY_TEXT.SECTIONS.EVENT_TRIGGER.LABEL}
                      error={!!errors.ruleEngine?.currentDropdownSelectedEvent}
                      helperText={
                        errors.ruleEngine?.currentDropdownSelectedEvent?.message
                      }
                      fullWidth
                    />
                  )}
                  fullWidth
                  ListboxProps={{
                    style: {
                      maxHeight: "300px",
                    },
                  }}
                  noOptionsText={
                    isLoading
                      ? "Loading events..."
                      : searchTerm
                      ? "No events found"
                      : "No events available"
                  }
                />
              </Box>
            )}
          />
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => {
              const newFilter: Filter = {
                propertyName: { label: "", isLocal: false },
                propertyType: "string",
                comparisonType: "=",
                comparisonValue: "",
                componentType: "filter",
              };
              append(newFilter);
            }}
            sx={eventTriggerSectionStyles.addFilterButton}
            variant="outlined"
          >
            {JOURNEY_TEXT.FILTERS.BUTTON}
          </Button>
        </Box>
      </Box>

      {fields.length > 0 && (
        <Box sx={eventTriggerSectionStyles.operatorSection}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Operator</InputLabel>
            <Controller
              name={`${filterPath}.operator` as Path<CreateJourneyFormData>}
              control={control}
              render={({ field }: { field: FieldValues }) => (
                <Select
                  {...field}
                  label="Operator"
                  value={field.value || "AND"}
                >
                  {OPERATOR_TYPES.map((op) => (
                    <MenuItem key={op.value} value={op.value || "AND"}>
                      {op.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Box>
      )}

      <Box sx={eventTriggerSectionStyles.filtersList}>
        {fields.map((fieldItem, index) => (
          <Box
            key={fieldItem.id}
            sx={eventTriggerSectionStyles.filterRowContainer}
          >
            <FilterRow
              key={fieldItem.id}
              control={control}
              errors={errors}
              index={index}
              onRemove={() => remove(index)}
              availableProperties={combinedProperties}
              isLoadingFilters={isLoadingFilters}
              propertyTypeMap={propertyTypeMap}
              filterPath={filterPath}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
