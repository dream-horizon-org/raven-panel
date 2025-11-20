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
import { useState, useMemo } from "react";
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

  const cohortOptions =
    cohortsData?.data?.map((cohortName) => ({
      value: cohortName,
      label: cohortName,
    })) || [];

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
        <Controller
          name="selectCohort.includedCohorts"
          control={control}
          render={({ field }: { field: FieldValues }) => {
            const selectedValue =
              Array.isArray(field.value) && field.value.length > 0
                ? field.value[0]
                : null;
            const selectedOption =
              cohortOptions.find((opt) => opt.value === selectedValue) || null;

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
                      label={JOURNEY_TEXT.SECTIONS.COHORT.LABEL}
                      error={!!errors.selectCohort?.includedCohorts}
                      helperText={errors.selectCohort?.includedCohorts?.message}
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
  );
}
