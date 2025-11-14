"use client";

import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Tooltip,
  Chip,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Controller,
  FieldValues,
  useWatch,
  useFormContext,
} from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import { useState, useMemo } from "react";
import { eventTriggerSectionStyles } from "../styles/eventTriggerSectionStyles";
import { CreateJourneyFormData } from "../types/journeyTypes";
import { JOURNEY_TEXT } from "../constants/journeyConstants";
import FilterRow from "./FilterRow";

interface EventTriggerSectionProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
  fields: Array<{ id: string }>;
  onAddFilter: () => void;
  onRemoveFilter: (index: number) => void;
  onOperatorChange: (operator: "AND" | "OR") => void;
  operator: "AND" | "OR";
  availableProperties: string[];
  isLoadingFilters: boolean;
  events: Array<{
    metadata: { eventName: string };
    properties: Array<{ propertyName: string; type: string }>;
  }>;
  isLoadingEvents: boolean;
  systemProperties: string[];
  systemPropertyTypes: Map<string, string>;
  isLoading: boolean;
}

export default function EventTriggerSection({
  control,
  errors,
  fields,
  onAddFilter,
  onRemoveFilter,
  onOperatorChange,
  operator,
  availableProperties,
  isLoadingFilters,
  events,
  isLoadingEvents,
  systemProperties,
  systemPropertyTypes,
  isLoading,
}: EventTriggerSectionProps) {
  const { setValue } = useFormContext<CreateJourneyFormData>();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const selectedEventName = useWatch({ control, name: "event" });

  const { combinedProperties, propertyTypeMap } = useMemo(() => {
    const eventProperties: string[] = [];
    const typeMap = new Map<string, string>();

    if (selectedEventName && events) {
      const selectedEvent = events.find(
        (e) => e.metadata.eventName === selectedEventName
      );
      if (selectedEvent?.properties) {
        selectedEvent.properties.forEach((prop) => {
          eventProperties.push(prop.propertyName);
          typeMap.set(prop.propertyName, prop.type || "string");
        });
      }
    }

    // Add system properties - we need to get their types from the systemPropertiesData
    // For now, default to "string" if type not available
    // Add system properties with their types from systemPropertyTypes map
    systemProperties.forEach((propName) => {
      if (!typeMap.has(propName)) {
        // Use type from systemPropertyTypes if available, otherwise default to "string"
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
  }, [selectedEventName, events, systemProperties]);

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
            name="event"
            control={control}
            rules={{ required: JOURNEY_TEXT.VALIDATION.EVENT_REQUIRED }}
            render={({ field }: { field: FieldValues }) => (
              <Box sx={eventTriggerSectionStyles.eventField}>
                <Autocomplete
                  options={filteredEvents}
                  getOptionLabel={(option) => option.metadata.eventName}
                  isOptionEqualToValue={(option, value) =>
                    option.metadata.eventName === value.metadata.eventName
                  }
                  loading={isLoading}
                  onInputChange={(_, newInputValue) => {
                    setSearchTerm(newInputValue);
                  }}
                  onChange={(_, newValue) => {
                    field.onChange(newValue ? newValue.metadata.eventName : "");
                  }}
                  value={
                    field.value
                      ? events.find(
                          (e) => e.metadata.eventName === field.value
                        ) || null
                      : null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={JOURNEY_TEXT.SECTIONS.EVENT_TRIGGER.LABEL}
                      error={!!errors.event}
                      helperText={errors.event?.message}
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
            onClick={onAddFilter}
            sx={eventTriggerSectionStyles.addFilterButton}
            variant="outlined"
          >
            {JOURNEY_TEXT.FILTERS.BUTTON}
          </Button>
        </Box>
      </Box>

      <Box sx={eventTriggerSectionStyles.filtersList}>
        {fields.map((fieldItem, index) => (
          <Box key={fieldItem.id} sx={eventTriggerSectionStyles.filterRowContainer}>
            {index > 0 && (
              <Chip
                label="AND"
                size="small"
                sx={eventTriggerSectionStyles.andChip(theme)}
              />
            )}
            <FilterRow
              control={control}
              errors={errors}
              index={index}
              onRemove={() => onRemoveFilter(index)}
              availableProperties={combinedProperties}
              isLoadingFilters={isLoadingFilters}
              propertyTypeMap={propertyTypeMap}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
