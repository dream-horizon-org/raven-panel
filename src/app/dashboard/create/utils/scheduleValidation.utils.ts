import { CreateJourneyFormData } from "../types/journey.interface";
import { Path } from "react-hook-form";
import { toast } from "sonner";

interface ScheduleValidationParams {
  data: CreateJourneyFormData;
  errors: {
    schedule?: {
      startDate?: { message?: string };
      startTime?: { message?: string };
      endDate?: { message?: string };
      endTime?: { message?: string };
      enableScheduledStart?: { message?: string };
      enableScheduledEnd?: { message?: string };
    };
  };
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void;
}

export const validateScheduledStart = ({
  data,
  setError,
}: ScheduleValidationParams): boolean => {
  if (!data.schedule?.enableScheduledStart) {
    return true;
  }

  if (!data.schedule.startDate || !data.schedule.startTime) {
    if (!data.schedule.startDate) {
      setError("schedule.startDate", {
        type: "required",
        message:
          "Start date is required when 'At specific date/time' is selected",
      });
    }
    if (!data.schedule.startTime) {
      setError("schedule.startTime", {
        type: "required",
        message:
          "Start time is required when 'At specific date/time' is selected",
      });
    }
    toast.error(
      "Please fill in both start date and time when 'At specific date/time' is selected"
    );
    return false;
  }

  const startDateTime = new Date(
    `${data.schedule.startDate}T${data.schedule.startTime}`
  );
  const now = new Date();
  if (startDateTime < now) {
    setError("schedule.startDate", {
      type: "validation",
      message: "Start date and time cannot be in the past",
    });
    setError("schedule.startTime", {
      type: "validation",
      message: "Start date and time cannot be in the past",
    });
    toast.error("Start date and time cannot be in the past");
    return false;
  }

  return true;
};

export const validateScheduledEnd = ({
  data,
  setError,
}: ScheduleValidationParams): boolean => {
  if (!data.schedule?.enableScheduledEnd) {
    return true;
  }

  if (!data.schedule.endDate || !data.schedule.endTime) {
    if (!data.schedule.endDate) {
      setError("schedule.endDate", {
        type: "required",
        message:
          "End date is required when 'At specific date/time' is selected",
      });
    }
    if (!data.schedule.endTime) {
      setError("schedule.endTime", {
        type: "required",
        message:
          "End time is required when 'At specific date/time' is selected",
      });
    }
    toast.error(
      "Please fill in both end date and time when 'At specific date/time' is selected"
    );
    return false;
  }

  const endDateTime = new Date(
    `${data.schedule.endDate}T${data.schedule.endTime}`
  );
  const now = new Date();
  if (endDateTime < now) {
    setError("schedule.endDate", {
      type: "validation",
      message: "End date and time cannot be in the past",
    });
    setError("schedule.endTime", {
      type: "validation",
      message: "End date and time cannot be in the past",
    });
    toast.error("End date and time cannot be in the past");
    return false;
  }

  return true;
};

export const hasScheduleErrors = (errors: {
  schedule?: {
    startDate?: { message?: string };
    startTime?: { message?: string };
    endDate?: { message?: string };
    endTime?: { message?: string };
    enableScheduledStart?: { message?: string };
    enableScheduledEnd?: { message?: string };
  };
}): boolean => {
  return !!(
    errors.schedule?.startDate ||
    errors.schedule?.startTime ||
    errors.schedule?.endDate ||
    errors.schedule?.endTime ||
    errors.schedule?.enableScheduledStart ||
    errors.schedule?.enableScheduledEnd
  );
};

export const validateSchedule = ({
  data,
  errors,
  setError,
}: ScheduleValidationParams): boolean => {
  if (!validateScheduledStart({ data, errors, setError })) {
    return false;
  }

  if (!validateScheduledEnd({ data, errors, setError })) {
    return false;
  }

  if (hasScheduleErrors(errors)) {
    console.error("Error: Schedule validation failed");
    toast.error(
      "Please fix all schedule errors before creating/updating the journey."
    );
    return false;
  }

  return true;
};
