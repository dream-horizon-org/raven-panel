"use client";

import {
  Box,
  Typography,
  Tooltip,
  TextField,
  Autocomplete,
  Select,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTheme } from "@mui/material/styles";
import { Controller, FieldValues } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { useState, useMemo, useEffect } from "react";
import { cohortSectionStyles } from "../styles/cohortSectionStyles";
import { CreateJourneyFormData } from "../types/journeyTypes";
import { JOURNEY_TEXT } from "../constants/journeyConstants";
import { useCohortsList } from "@/hooks/useCohortsList";

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
      console.log("Cohorts API Response:", cohortsData);
      console.log("Cohorts Data Type:", typeof cohortsData);
      console.log("Cohorts Data.data:", cohortsData.data);
      console.log("Is Array:", Array.isArray(cohortsData.data));
    }
  }, [cohortsData]);

  // Safely extract cohorts array from response
  // Handle different possible response structures
  const cohortOptions = useMemo(() => {
    if (!cohortsData) return [];

    let cohortsArray: string[] = [];

    // If data is directly an array
    if (Array.isArray(cohortsData.data)) {
      cohortsArray = cohortsData.data;
    }
    // If data is an object with an array property
    else if (cohortsData.data && typeof cohortsData.data === "object") {
      // Check for common array property names
      if (Array.isArray((cohortsData.data as any).items)) {
        cohortsArray = (cohortsData.data as any).items;
      } else if (Array.isArray((cohortsData.data as any).cohorts)) {
        cohortsArray = (cohortsData.data as any).cohorts;
      } else if (Array.isArray((cohortsData.data as any).data)) {
        cohortsArray = (cohortsData.data as any).data;
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
        cohortsArray = arrayValue as string[];
      }
    }

    // Map to options format
    return cohortsArray.map((cohortName) => ({
      value: cohortName,
      label: cohortName,
    }));
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
