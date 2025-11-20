"use client";

import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useTheme } from "@mui/material/styles";
import { Controller, FieldValues } from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { CreateJourneyFormData } from "../types/journeyTypes";
import { JOURNEY_TEXT } from "../constants/journeyConstants";
import { scheduleSectionStyles } from "../styles/scheduleSectionStyles";

interface ScheduleSectionProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
}

export default function ScheduleSection({
  control,
}: ScheduleSectionProps) {
  const theme = useTheme();

  const getTimezone = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset <= 0 ? "+" : "-";
    return `${timezone}, UTC ${sign}${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <Box sx={scheduleSectionStyles.formCard(theme)}>
      <Box sx={scheduleSectionStyles.formSection}>
        {/* Start date/time */}
        <Box sx={scheduleSectionStyles.dateTimeSection}>
          <Box sx={scheduleSectionStyles.fieldHeader}>
            <Box sx={scheduleSectionStyles.fieldHeaderContent}>
              <ScheduleIcon sx={scheduleSectionStyles.fieldHeaderIcon} />
              <Typography sx={scheduleSectionStyles.fieldLabel(theme)}>
                {JOURNEY_TEXT.SECTIONS.SCHEDULE.START_DATE_TIME.TITLE}
              </Typography>
            </Box>
            <Typography sx={scheduleSectionStyles.fieldSubtext}>
              {JOURNEY_TEXT.SECTIONS.SCHEDULE.START_DATE_TIME.DESCRIPTION}
            </Typography>
          </Box>

          <Controller
            name="schedule.startType"
            control={control}
            defaultValue="immediate"
            render={({ field }: { field: FieldValues }) => (
              <RadioGroup {...field} sx={scheduleSectionStyles.radioGroup}>
                <FormControlLabel
                  value="immediate"
                  control={<Radio />}
                  label={
                    JOURNEY_TEXT.SECTIONS.SCHEDULE.START_DATE_TIME.IMMEDIATE
                  }
                />
                <FormControlLabel
                  value="scheduled"
                  control={<Radio />}
                  label={
                    JOURNEY_TEXT.SECTIONS.SCHEDULE.START_DATE_TIME.SCHEDULED
                  }
                />
              </RadioGroup>
            )}
          />

          <Controller
            name="schedule.startType"
            control={control}
            render={({ field }: { field: FieldValues }) => {
              if (field.value === "scheduled") {
                return (
                  <Box sx={scheduleSectionStyles.dateTimeFields}>
                    <Controller
                      name="schedule.startDate"
                      control={control}
                      render={({
                        field: dateField,
                      }: {
                        field: FieldValues;
                      }) => (
                        <TextField
                          {...dateField}
                          type="date"
                          size="small"
                          sx={scheduleSectionStyles.dateField}
                        />
                      )}
                    />
                    <Typography sx={scheduleSectionStyles.dateTimeLabel}>
                      {
                        JOURNEY_TEXT.SECTIONS.SCHEDULE.START_DATE_TIME
                          .DATE_LABEL
                      }
                    </Typography>
                    <Controller
                      name="schedule.startTime"
                      control={control}
                      render={({
                        field: timeField,
                      }: {
                        field: FieldValues;
                      }) => (
                        <TextField
                          {...timeField}
                          type="time"
                          size="small"
                          sx={scheduleSectionStyles.timeField}
                        />
                      )}
                    />
                    <Typography sx={scheduleSectionStyles.timezoneText}>
                      ({getTimezone()})
                    </Typography>
                  </Box>
                );
              }
              return <Box />;
            }}
          />
        </Box>

        {/* End date/time */}
        <Box sx={scheduleSectionStyles.dateTimeSection}>
          <Box sx={scheduleSectionStyles.fieldHeader}>
            <Box sx={scheduleSectionStyles.fieldHeaderContent}>
              <ScheduleIcon sx={scheduleSectionStyles.fieldHeaderIcon} />
              <Typography sx={scheduleSectionStyles.fieldLabel(theme)}>
                {JOURNEY_TEXT.SECTIONS.SCHEDULE.END_DATE_TIME.TITLE}
              </Typography>
            </Box>
            <Typography sx={scheduleSectionStyles.fieldSubtext}>
              {JOURNEY_TEXT.SECTIONS.SCHEDULE.END_DATE_TIME.DESCRIPTION}
            </Typography>
          </Box>

          <Box sx={scheduleSectionStyles.dateTimeFields}>
            <Controller
              name="schedule.endDate"
              control={control}
              render={({ field: dateField }: { field: FieldValues }) => (
                <TextField
                  {...dateField}
                  type="date"
                  size="small"
                  sx={scheduleSectionStyles.dateField}
                />
              )}
            />
            <Typography sx={scheduleSectionStyles.dateTimeLabel}>
              {JOURNEY_TEXT.SECTIONS.SCHEDULE.END_DATE_TIME.DATE_LABEL}
            </Typography>
            <Controller
              name="schedule.endTime"
              control={control}
              render={({ field: timeField }: { field: FieldValues }) => (
                <TextField
                  {...timeField}
                  type="time"
                  size="small"
                  sx={scheduleSectionStyles.timeField}
                />
              )}
            />
            <Typography sx={scheduleSectionStyles.timezoneText}>
              ({getTimezone()})
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
