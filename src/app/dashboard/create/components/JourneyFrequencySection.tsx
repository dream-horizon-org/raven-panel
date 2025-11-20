"use client";

import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import RepeatIcon from "@mui/icons-material/Repeat";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTheme } from "@mui/material/styles";
import { Controller, FieldValues } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";

import { CreateJourneyFormData } from "../types/journeyTypes";
import { JOURNEY_TEXT } from "../constants/journeyConstants";
import { journeyFrequencySectionStyles } from "../styles/journeyFrequencySectionStyles";

interface JourneyFrequencySectionProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
}

const PERIOD_UNITS = [
  { value: "days", label: "days" },
  { value: "hours", label: "hours" },
  { value: "weeks", label: "weeks" },
  { value: "months", label: "months" },
] as const;

export default function JourneyFrequencySection({
  control,
  errors,
}: JourneyFrequencySectionProps) {
  const theme = useTheme();

  return (
    <Box sx={journeyFrequencySectionStyles.formCard(theme)}>
      <Box sx={journeyFrequencySectionStyles.formSection}>
        <Box sx={journeyFrequencySectionStyles.fieldHeader}>
          <Box sx={journeyFrequencySectionStyles.fieldHeaderContent}>
            <RepeatIcon sx={journeyFrequencySectionStyles.fieldHeaderIcon} />
            <Typography sx={journeyFrequencySectionStyles.fieldLabel(theme)}>
              {JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY.TITLE}
            </Typography>
            <Tooltip
              title={JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY.TOOLTIP}
              placement="top"
            >
              <HelpOutlineIcon
                sx={journeyFrequencySectionStyles.fieldInfoIcon}
              />
            </Tooltip>
          </Box>
        </Box>

        {/* Times in session */}
        <Box sx={journeyFrequencySectionStyles.frequencyRow}>
          <Typography sx={journeyFrequencySectionStyles.labelText}>
            {JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY.TIMES_IN_SESSION}
          </Typography>
          <Controller
            name="journeyFrequency.timesInSession"
            control={control}
            render={({ field }: { field: FieldValues }) => (
              <TextField
                {...field}
                type="number"
                size="small"
                sx={journeyFrequencySectionStyles.numberInput}
                value={field.value ?? ""}
                inputProps={{ min: 0 }}
              />
            )}
          />
          <Typography sx={journeyFrequencySectionStyles.labelText}>
            {JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY.TIMES_IN_SESSION_SUFFIX}
          </Typography>
        </Box>

        {/* Max times in period */}
        <Box sx={journeyFrequencySectionStyles.frequencyRow}>
          <Typography sx={journeyFrequencySectionStyles.labelText}>
            {JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY.MAX_TIMES_IN_PERIOD}
          </Typography>
          <Controller
            name="journeyFrequency.maxTimesInPeriod"
            control={control}
            render={({ field }: { field: FieldValues }) => (
              <TextField
                {...field}
                type="number"
                size="small"
                sx={journeyFrequencySectionStyles.numberInput}
                value={field.value ?? ""}
                inputProps={{ min: 0 }}
              />
            )}
          />
          <Typography sx={journeyFrequencySectionStyles.labelText}>
            {JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY.MAX_TIMES_IN_PERIOD_MIDDLE}
          </Typography>
          <Controller
            name="journeyFrequency.periodValue"
            control={control}
            render={({ field }: { field: FieldValues }) => (
              <TextField
                {...field}
                type="number"
                size="small"
                sx={journeyFrequencySectionStyles.numberInput}
                value={field.value ?? ""}
                inputProps={{ min: 0 }}
              />
            )}
          />
          <Controller
            name="journeyFrequency.periodUnit"
            control={control}
            render={({ field }: { field: FieldValues }) => (
              <FormControl
                size="small"
                sx={journeyFrequencySectionStyles.periodUnitSelect}
              >
                <Select {...field} value={field.value || "days"}>
                  {PERIOD_UNITS.map((unit) => (
                    <MenuItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>

        {/* Max times in lifetime */}
        <Box sx={journeyFrequencySectionStyles.frequencyRow}>
          <Typography sx={journeyFrequencySectionStyles.labelText}>
            {JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY.MAX_TIMES_IN_LIFETIME}
          </Typography>
          <Controller
            name="journeyFrequency.maxTimesInLifetime"
            control={control}
            render={({ field }: { field: FieldValues }) => (
              <TextField
                {...field}
                type="number"
                size="small"
                sx={journeyFrequencySectionStyles.numberInput}
                value={field.value ?? ""}
                inputProps={{ min: 0 }}
              />
            )}
          />
          <Typography sx={journeyFrequencySectionStyles.labelText}>
            {
              JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY
                .MAX_TIMES_IN_LIFETIME_SUFFIX
            }
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
