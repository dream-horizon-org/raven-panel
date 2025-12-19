"use client";

import {
  Box,
  Typography,
  Tooltip,
  TextField,
  Autocomplete,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTheme } from "@mui/material/styles";
import { Controller, FieldValues } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { useState, useMemo, useEffect } from "react";
import { cohortSectionStyles } from "./content/styles/cohortSectionStyles";
import { CreateJourneyFormData } from "../types/journey.interface";
import { JOURNEY_TEXT } from "../constants/journeyConstants";
import { useCohortsList } from "@/app/dashboard/create/hooks/useCohortsList";

interface CohortRecord {
  id: number;
  name: string;
  description?: string;
  lastBatchExecutionTime?: number;
  userCount?: number;
  cohortType: string;
  verified: boolean;
}

interface CohortOption {
  value: string;
  label: string;
}

interface CohortSectionProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
}

export default function CohortSection({ control, errors }: CohortSectionProps) {
  const theme = useTheme();
  const { data: cohortsData, isLoading: isLoadingCohorts } = useCohortsList();
  const [searchTerm, setSearchTerm] = useState("");

  // Debug: Log the response structure to understand the API format
  useEffect(() => {
    if (cohortsData) {
    }
  }, [cohortsData]);

  // Safely extract cohorts array from response
  // Handle different possible response structures
  const cohortOptions = useMemo((): CohortOption[] => {
    if (!cohortsData) return [];

    let cohortsArray: (string | CohortRecord)[] = [];

    // If data is directly an array
    if (Array.isArray(cohortsData.data)) {
      cohortsArray = cohortsData.data;
    }
    // If data is an object with an array property
    else if (cohortsData.data && typeof cohortsData.data === "object") {
      const dataObj = cohortsData.data as Record<string, unknown>;

      // Check for records array (API structure: data.records)
      if (Array.isArray(dataObj.records)) {
        cohortsArray = dataObj.records as CohortRecord[];
      }
      // Check for other common array property names
      else if (Array.isArray(dataObj.items)) {
        cohortsArray = dataObj.items as (string | CohortRecord)[];
      } else if (Array.isArray(dataObj.cohorts)) {
        cohortsArray = dataObj.cohorts as (string | CohortRecord)[];
      } else if (Array.isArray(dataObj.data)) {
        cohortsArray = dataObj.data as (string | CohortRecord)[];
      }
    }
    // If cohortsData itself is an array
    else if (Array.isArray(cohortsData)) {
      cohortsArray = cohortsData;
    }
    // If response has a different structure, try to find array values
    else if (typeof cohortsData === "object") {
      const values = Object.values(cohortsData);
      const arrayValue = values.find((v) => Array.isArray(v));
      if (arrayValue) {
        cohortsArray = arrayValue as (string | CohortRecord)[];
      }
    }

    // Map to options format
    // Handle both string arrays and object arrays (with name property)
    return cohortsArray.map(
      (cohort): CohortOption => {
        // If cohort is a string, use it directly
        if (typeof cohort === "string") {
          return {
            value: cohort,
            label: cohort,
          };
        }
        // If cohort is an object, extract the name property
        else if (cohort && typeof cohort === "object" && "name" in cohort) {
          const cohortRecord = cohort as CohortRecord;
          return {
            value: cohortRecord.name,
            label: cohortRecord.name,
          };
        }
        // Fallback: try to convert to string
        else {
          return {
            value: String(cohort),
            label: String(cohort),
          };
        }
      }
    );
  }, [cohortsData]);

  const filteredCohorts = useMemo(() => {
    if (!searchTerm) {
      return cohortOptions;
    }
    return cohortOptions.filter((cohort) =>
      cohort.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cohortOptions, searchTerm]);

  return (
    <Box sx={cohortSectionStyles.formCard(theme)}>
      <Box sx={cohortSectionStyles.formSection}>
        <Box sx={cohortSectionStyles.fieldHeader}>
          <Box sx={cohortSectionStyles.fieldHeaderContent}>
            <GroupsIcon sx={cohortSectionStyles.fieldHeaderIcon} />
            <Typography sx={cohortSectionStyles.fieldLabel(theme)}>
              {JOURNEY_TEXT.SECTIONS.COHORT.TITLE}
            </Typography>
            <Tooltip
              title={JOURNEY_TEXT.SECTIONS.COHORT.TOOLTIP}
              placement="top"
              arrow
            >
              <HelpOutlineIcon sx={cohortSectionStyles.fieldInfoIcon} />
            </Tooltip>
          </Box>
          <Typography sx={cohortSectionStyles.fieldSubtext}>
            {JOURNEY_TEXT.SECTIONS.COHORT.DESCRIPTION}
          </Typography>
        </Box>
        <Box sx={cohortSectionStyles.selectContainer}>
          <Typography sx={cohortSectionStyles.selectLabel}>
            {JOURNEY_TEXT.SECTIONS.COHORT.LABEL}
          </Typography>
          <Controller
            name="selectCohort.includedCohorts"
            control={control}
            render={({ field }: { field: FieldValues }) => {
              const selectedValue =
                Array.isArray(field.value) && field.value.length > 0
                  ? field.value[0]
                  : null;
              const selectedOption =
                cohortOptions.find((opt) => opt.value === selectedValue) ||
                null;

              return (
                <Box>
                  <Autocomplete
                    options={filteredCohorts}
                    getOptionLabel={(option) => option.label}
                    value={selectedOption}
                    loading={isLoadingCohorts}
                    onInputChange={(_, newInputValue) => {
                      setSearchTerm(newInputValue);
                    }}
                    onChange={(_, newValue) => {
                      field.onChange(newValue ? [newValue.value] : []);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label={JOURNEY_TEXT.SECTIONS.COHORT.LABEL}
                        error={!!errors.selectCohort?.includedCohorts}
                        helperText={
                          errors.selectCohort?.includedCohorts?.message
                        }
                        sx={cohortSectionStyles.selectField}
                      />
                    )}
                    ListboxProps={{
                      style: {
                        maxHeight: "300px",
                      },
                    }}
                    noOptionsText={
                      isLoadingCohorts
                        ? "Loading cohorts..."
                        : searchTerm
                        ? "No cohorts found"
                        : "No cohorts available"
                    }
                  />
                </Box>
              );
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
