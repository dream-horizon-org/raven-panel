"use client";

import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import RepeatIcon from "@mui/icons-material/Repeat";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTheme } from "@mui/material/styles";
import { Controller, FieldValues } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";

import { CreateJourneyFormData } from "../types/journey.interface";
import { JOURNEY_TEXT, PERIOD_UNITS } from "../constants/journeyConstants";
import { journeyFrequencySectionStyles } from "./content/styles/journeyFrequencySectionStyles";

interface JourneyFrequencySectionProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
}

export default function JourneyFrequencySection({
  control,
  errors,
}: JourneyFrequencySectionProps) {
  const theme = useTheme();
  const hasError = !!errors.journeyFrequency;

  return (
    <Box sx={journeyFrequencySectionStyles.formCard(theme, hasError)}>
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
              arrow
            >
              <HelpOutlineIcon
                sx={journeyFrequencySectionStyles.fieldInfoIcon}
              />
            </Tooltip>
          </Box>
          {hasError && (
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "error.main",
                mt: 0.5,
                ml: 4.25,
              }}
            >
              {(errors.journeyFrequency?.message as string) ||
                JOURNEY_TEXT.ERRORS.AT_LEAST_ONE_FREQUENCY_OPTION}
            </Typography>
          )}
        </Box>

        <Box sx={journeyFrequencySectionStyles.frequencyRow}>
          <Controller
            name="journeyFrequency.enableMaxTimesInLifetime"
            control={control}
            defaultValue={false}
            render={({ field: enableField }: { field: FieldValues }) => (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...enableField}
                      checked={enableField.value || false}
                      size="small"
                    />
                  }
                  label={
                    <Typography sx={journeyFrequencySectionStyles.labelText}>
                      {
                        JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY
                          .MAX_TIMES_IN_LIFETIME
                      }
                    </Typography>
                  }
                />
                <Controller
                  name="journeyFrequency.maxTimesInLifetime"
                  control={control}
                  render={({ field: inputField }: { field: FieldValues }) => (
                    <TextField
                      {...inputField}
                      type="number"
                      size="small"
                      disabled={!enableField.value}
                      sx={journeyFrequencySectionStyles.numberInput}
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
              </>
            )}
          />
        </Box>

        {/* Times in session */}
        <Box sx={journeyFrequencySectionStyles.frequencyRow}>
          <Controller
            name="journeyFrequency.enableTimesInSession"
            control={control}
            defaultValue={false}
            render={({ field: enableField }: { field: FieldValues }) => (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...enableField}
                      checked={enableField.value || false}
                      size="small"
                    />
                  }
                  label={
                    <Typography sx={journeyFrequencySectionStyles.labelText}>
                      {JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY.TIMES_IN_SESSION}
                    </Typography>
                  }
                />
                <Controller
                  name="journeyFrequency.timesInSession"
                  control={control}
                  render={({ field: inputField }: { field: FieldValues }) => (
                    <TextField
                      {...inputField}
                      type="number"
                      size="small"
                      disabled={!enableField.value}
                      sx={journeyFrequencySectionStyles.numberInput}
                      inputProps={{ min: 0 }}
                    />
                  )}
                />
                <Typography sx={journeyFrequencySectionStyles.labelText}>
                  {
                    JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY
                      .TIMES_IN_SESSION_SUFFIX
                  }
                </Typography>
              </>
            )}
          />
        </Box>

        {/* Max times in period */}
        <Box sx={journeyFrequencySectionStyles.frequencyRow}>
          <Controller
            name="journeyFrequency.enableMaxTimesInPeriod"
            control={control}
            defaultValue={false}
            render={({ field: enableField }: { field: FieldValues }) => (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...enableField}
                      checked={enableField.value || false}
                      size="small"
                    />
                  }
                  label={
                    <Typography sx={journeyFrequencySectionStyles.labelText}>
                      {
                        JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY
                          .MAX_TIMES_IN_PERIOD
                      }
                    </Typography>
                  }
                />
                <Controller
                  name="journeyFrequency.maxTimesInPeriod"
                  control={control}
                  render={({ field: inputField }: { field: FieldValues }) => (
                    <TextField
                      {...inputField}
                      type="number"
                      size="small"
                      disabled={!enableField.value}
                      sx={journeyFrequencySectionStyles.numberInput}
                      inputProps={{ min: 0 }}
                    />
                  )}
                />
                <Typography sx={journeyFrequencySectionStyles.labelText}>
                  {
                    JOURNEY_TEXT.SECTIONS.JOURNEY_FREQUENCY
                      .MAX_TIMES_IN_PERIOD_MIDDLE
                  }
                </Typography>
                <Controller
                  name="journeyFrequency.periodValue"
                  control={control}
                  render={({ field: periodField }: { field: FieldValues }) => (
                    <TextField
                      {...periodField}
                      type="number"
                      size="small"
                      disabled={!enableField.value}
                      sx={journeyFrequencySectionStyles.numberInput}
                      inputProps={{ min: 0 }}
                    />
                  )}
                />
                <Controller
                  name="journeyFrequency.periodUnit"
                  control={control}
                  render={({ field: unitField }: { field: FieldValues }) => (
                    <FormControl
                      size="small"
                      sx={journeyFrequencySectionStyles.periodUnitSelect}
                      disabled={!enableField.value}
                    >
                      <Select {...unitField} value={unitField.value || "days"}>
                        {PERIOD_UNITS.map((unit) => (
                          <MenuItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}
