"use client";

import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTheme } from "@mui/material/styles";
import { Controller, FieldValues } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { cohortSectionStyles } from "../styles/cohortSectionStyles";
import { CreateJourneyFormData } from "../types/journeyTypes";
import { COHORT_OPTIONS, JOURNEY_TEXT } from "../constants/journeyConstants";

interface CohortSectionProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
}

export default function CohortSection({ control, errors }: CohortSectionProps) {
  const theme = useTheme();

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
            name="cohort"
            control={control}
            render={({ field }: { field: FieldValues }) => (
              <FormControl
                error={!!errors.cohort}
                sx={cohortSectionStyles.selectField}
              >
                <Select {...field} displayEmpty>
                  {COHORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.cohort && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.5 }}
                  >
                    {errors.cohort.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}
