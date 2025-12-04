"use client";

import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useTheme } from "@mui/material/styles";
import React, { useEffect } from "react";
import {
  Controller,
  FieldValues,
  useWatch,
  useFormContext,
} from "react-hook-form";
import { Control, FieldErrors } from "react-hook-form";
import { CreateJourneyFormData } from "../types/journey.interface";
import { JOURNEY_TEXT } from "../constants/journeyConstants";
import { scheduleSectionStyles } from "./content/styles/scheduleSectionStyles";
import { usePermissions } from "@/app/providers/PermissionProvider";

interface ScheduleSectionProps {
  control: Control<CreateJourneyFormData>;
  errors: FieldErrors<CreateJourneyFormData>;
}

export default function ScheduleSection({
  control,
  errors,
}: ScheduleSectionProps) {
  const theme = useTheme();
  const { hasPublishAccess, hasEditAccess } = usePermissions();
  const { setValue, trigger, setError, clearErrors } = useFormContext<
    CreateJourneyFormData
  >();

  // Note: enableImmediateStart is watched but not directly used - triggers form validation
  useWatch({
    control,
    name: "schedule.enableImmediateStart",
  });

  const enableScheduledStart = useWatch({
    control,
    name: "schedule.enableScheduledStart",
  });

  const startDate = useWatch({
    control,
    name: "schedule.startDate",
  });

  const startTime = useWatch({
    control,
    name: "schedule.startTime",
  });

  const enableScheduledEnd = useWatch({
    control,
    name: "schedule.enableScheduledEnd",
  });

  const endDate = useWatch({
    control,
    name: "schedule.endDate",
  });

  const endTime = useWatch({
    control,
    name: "schedule.endTime",
  });

  useEffect(() => {
    if (enableScheduledStart) {
      if (!startDate || !startTime) {
        if (!startDate) {
          setError("schedule.startDate", {
            type: "required",
            message: "Start date is required",
          });
        }
        if (!startTime) {
          setError("schedule.startTime", {
            type: "required",
            message: "Start time is required",
          });
        }
      } else {
        clearErrors("schedule.startDate");
        clearErrors("schedule.startTime");
      }
    }
  }, [enableScheduledStart, startDate, startTime, setError, clearErrors]);

  useEffect(() => {
    if (enableScheduledEnd) {
      if (!endDate || !endTime) {
        if (!endDate) {
          setError("schedule.endDate", {
            type: "required",
            message: "End date is required",
          });
        }
        if (!endTime) {
          setError("schedule.endTime", {
            type: "required",
            message: "End time is required",
          });
        }
      } else {
        clearErrors("schedule.endDate");
        clearErrors("schedule.endTime");
      }
    }
  }, [enableScheduledEnd, endDate, endTime, setError, clearErrors]);

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

          {/* Checkboxes for Start Date/Time options */}
          {/* As soon as journey is published */}
          <Box sx={scheduleSectionStyles.frequencyRow}>
            <Controller
              name="schedule.enableImmediateStart"
              control={control}
              defaultValue={false}
              render={({ field }: { field: FieldValues }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value || false}
                      size="small"
                      disabled={!hasEditAccess}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        field.onChange(checked);
                        if (checked) {
                          setValue("schedule.enableScheduledStart", false);
                          setValue("schedule.startDate", null);
                          setValue("schedule.startTime", null);
                        }
                      }}
                    />
                  }
                  label={
                    <Typography sx={scheduleSectionStyles.labelText}>
                      {JOURNEY_TEXT.SECTIONS.SCHEDULE.START_DATE_TIME.IMMEDIATE}
                    </Typography>
                  }
                />
              )}
            />
          </Box>

          {/* At specific date/time */}
          <Box sx={scheduleSectionStyles.frequencyRow}>
            <Controller
              name="schedule.enableScheduledStart"
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
                        disabled={!hasEditAccess}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          enableField.onChange(checked);

                          if (checked) {
                            setValue("schedule.enableImmediateStart", false);
                            setTimeout(() => {
                              trigger("schedule.startDate");
                              trigger("schedule.startTime");
                            }, 0);
                          } else {
                            setValue("schedule.startDate", null);
                            setValue("schedule.startTime", null);
                            clearErrors("schedule.startDate");
                            clearErrors("schedule.startTime");
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={scheduleSectionStyles.labelText}>
                        {
                          JOURNEY_TEXT.SECTIONS.SCHEDULE.START_DATE_TIME
                            .SCHEDULED
                        }
                      </Typography>
                    }
                  />
                  {enableField.value && (
                    <Box
                      sx={{
                        ...scheduleSectionStyles.dateTimeFields,
                        ml: 2,
                        mt: 1,
                      }}
                    >
                      <Controller
                        name="schedule.startDate"
                        control={control}
                        rules={{
                          required: enableScheduledStart
                            ? "Start date is required"
                            : false,
                        }}
                        render={({
                          field: dateField,
                        }: {
                          field: FieldValues;
                        }) => {
                          const error = errors.schedule?.startDate;
                          return (
                            <TextField
                              {...dateField}
                              type="date"
                              size="small"
                              sx={scheduleSectionStyles.dateField}
                              value={dateField.value || ""}
                              disabled={!hasPublishAccess}
                              error={!!error}
                              helperText={error?.message as string}
                              required={enableScheduledStart}
                            />
                          );
                        }}
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
                        rules={{
                          required: enableScheduledStart
                            ? "Start time is required"
                            : false,
                        }}
                        render={({
                          field: timeField,
                        }: {
                          field: FieldValues;
                        }) => {
                          const error = errors.schedule?.startTime;
                          return (
                            <TextField
                              {...timeField}
                              type="time"
                              size="small"
                              sx={scheduleSectionStyles.timeField}
                              value={timeField.value || ""}
                              disabled={!hasPublishAccess}
                              error={!!error}
                              helperText={error?.message as string}
                              required={enableScheduledStart}
                            />
                          );
                        }}
                      />
                      <Typography sx={scheduleSectionStyles.timezoneText}>
                        ({getTimezone()})
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            />
          </Box>
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

          {/* Checkboxes for End Date/Time options */}
          {/* At specific date/time */}
          <Box sx={scheduleSectionStyles.frequencyRow}>
            <Controller
              name="schedule.enableScheduledEnd"
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
                        disabled={!hasEditAccess}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          enableField.onChange(checked);
                          if (checked) {
                            setTimeout(() => {
                              trigger("schedule.endDate");
                              trigger("schedule.endTime");
                            }, 0);
                          } else {
                            setValue("schedule.endDate", null);
                            setValue("schedule.endTime", null);
                            clearErrors("schedule.endDate");
                            clearErrors("schedule.endTime");
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={scheduleSectionStyles.labelText}>
                        {JOURNEY_TEXT.SECTIONS.SCHEDULE.END_DATE_TIME.SCHEDULED}
                      </Typography>
                    }
                  />
                  {enableField.value && (
                    <Box
                      sx={{
                        ...scheduleSectionStyles.dateTimeFields,
                        ml: 2,
                        mt: 1,
                      }}
                    >
                      <Controller
                        name="schedule.endDate"
                        control={control}
                        rules={{
                          required: enableScheduledEnd
                            ? "End date is required"
                            : false,
                        }}
                        render={({
                          field: dateField,
                        }: {
                          field: FieldValues;
                        }) => {
                          const error = errors.schedule?.endDate;
                          return (
                            <TextField
                              {...dateField}
                              type="date"
                              size="small"
                              sx={scheduleSectionStyles.dateField}
                              value={dateField.value || ""}
                              disabled={!hasPublishAccess}
                              error={!!error}
                              helperText={error?.message as string}
                              required={enableScheduledEnd}
                            />
                          );
                        }}
                      />
                      <Typography sx={scheduleSectionStyles.dateTimeLabel}>
                        {
                          JOURNEY_TEXT.SECTIONS.SCHEDULE.END_DATE_TIME
                            .DATE_LABEL
                        }
                      </Typography>
                      <Controller
                        name="schedule.endTime"
                        control={control}
                        rules={{
                          required: enableScheduledEnd
                            ? "End time is required"
                            : false,
                        }}
                        render={({
                          field: timeField,
                        }: {
                          field: FieldValues;
                        }) => {
                          const error = errors.schedule?.endTime;
                          return (
                            <TextField
                              {...timeField}
                              type="time"
                              size="small"
                              sx={scheduleSectionStyles.timeField}
                              value={timeField.value || ""}
                              disabled={!hasPublishAccess}
                              error={!!error}
                              helperText={error?.message as string}
                              required={enableScheduledEnd}
                            />
                          );
                        }}
                      />
                      <Typography sx={scheduleSectionStyles.timezoneText}>
                        ({getTimezone()})
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
