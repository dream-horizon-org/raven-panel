import {
  CreateJourneyFormData,
  ValidationResult,
  ValidationError,
  NudgeEvent,
  ReactNativeJson,
} from "../types/journey.interface";
import { Path } from "react-hook-form";

const validateSchedule = (data: CreateJourneyFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (data.schedule?.enableScheduledStart) {
    if (!data.schedule.startDate || !data.schedule.startTime) {
      const fieldErrors: Array<{
        path: Path<CreateJourneyFormData>;
        type: string;
        message: string;
      }> = [];

      if (!data.schedule.startDate) {
        const path = "schedule.startDate" as Path<CreateJourneyFormData>;
        fieldErrors.push({
          path,
          type: "required",
          message:
            "Start date is required when 'At specific date/time' is selected",
        });
      }

      if (!data.schedule.startTime) {
        const path = "schedule.startTime" as Path<CreateJourneyFormData>;
        fieldErrors.push({
          path,
          type: "required",
          message:
            "Start time is required when 'At specific date/time' is selected",
        });
      }

      errors.push({
        type: "schedule",
        message:
          "Please fill in both start date and time when 'At specific date/time' is selected",
        fieldErrors,
      });
    } else {
      const startDateTime = new Date(
        `${data.schedule.startDate}T${data.schedule.startTime}`
      );
      const now = new Date();
      if (startDateTime < now) {
        const fieldErrors: Array<{
          path: Path<CreateJourneyFormData>;
          type: string;
          message: string;
        }> = [];

        const startDatePath = "schedule.startDate" as Path<
          CreateJourneyFormData
        >;
        const startTimePath = "schedule.startTime" as Path<
          CreateJourneyFormData
        >;
        const error = {
          type: "validation",
          message: "Start date and time cannot be in the past",
        };

        fieldErrors.push({ path: startDatePath, ...error });
        fieldErrors.push({ path: startTimePath, ...error });

        errors.push({
          type: "schedule",
          message: "Start date and time cannot be in the past",
          fieldErrors,
        });
      }
    }
  }

  if (data.schedule?.enableScheduledEnd) {
    if (!data.schedule.endDate || !data.schedule.endTime) {
      const fieldErrors: Array<{
        path: Path<CreateJourneyFormData>;
        type: string;
        message: string;
      }> = [];

      if (!data.schedule.endDate) {
        const path = "schedule.endDate" as Path<CreateJourneyFormData>;
        fieldErrors.push({
          path,
          type: "required",
          message:
            "End date is required when 'At specific date/time' is selected",
        });
      }

      if (!data.schedule.endTime) {
        const path = "schedule.endTime" as Path<CreateJourneyFormData>;
        fieldErrors.push({
          path,
          type: "required",
          message:
            "End time is required when 'At specific date/time' is selected",
        });
      }

      errors.push({
        type: "schedule",
        message:
          "Please fill in both end date and time when 'At specific date/time' is selected",
        fieldErrors,
      });
    } else {
      const endDateTime = new Date(
        `${data.schedule.endDate}T${data.schedule.endTime}`
      );
      const now = new Date();
      if (endDateTime < now) {
        const fieldErrors: Array<{
          path: Path<CreateJourneyFormData>;
          type: string;
          message: string;
        }> = [];

        const endDatePath = "schedule.endDate" as Path<CreateJourneyFormData>;
        const endTimePath = "schedule.endTime" as Path<CreateJourneyFormData>;
        const error = {
          type: "validation",
          message: "End date and time cannot be in the past",
        };

        fieldErrors.push({ path: endDatePath, ...error });
        fieldErrors.push({ path: endTimePath, ...error });

        errors.push({
          type: "schedule",
          message: "End date and time cannot be in the past",
          fieldErrors,
        });
      }
    }
  }

  return errors;
};

const validateActions = (data: CreateJourneyFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    !data.nudgeSelection?.actions ||
    data.nudgeSelection.actions.length === 0
  ) {
    errors.push({
      type: "actions",
      message:
        "Please configure at least one engagement template before creating the journey.",
    });
    return errors;
  }

  const actionsWithoutTemplate = data.nudgeSelection.actions.filter(
    (action) => !action.template
  );
  if (actionsWithoutTemplate.length > 0) {
    errors.push({
      type: "actions",
      message:
        "Please ensure all actions have templates configured before creating the journey.",
    });
  }

  return errors;
};

const validateTemplates = (data: CreateJourneyFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.nudgeSelection?.actions) {
    return errors;
  }

  // Check if templates have basic structure
  const templatesWithoutStructure = data.nudgeSelection.actions.filter(
    (action) => {
      if (!action.template) return true;
      const template = action.template;
      
      const isNudgeEvent = (t: ReactNativeJson | NudgeEvent): t is NudgeEvent => {
        return "eventName" in t;
      };
      
      // Check if template has meaningful content
      let hasContent: boolean = false;
      if (isNudgeEvent(template)) {
        hasContent =
          !!template.eventName &&
          !!template.eventParams &&
          template.eventParams.length > 0;
      } else {
        hasContent =
          !!(template.children && template.children.length > 0) ||
          !!(template.props && Object.keys(template.props).length > 1) ||
          !!(template.styles && Object.keys(template.styles).length > 0);
      }
      
      return !hasContent;
    }
  );

  if (templatesWithoutStructure.length > 0) {
    errors.push({
      type: "template",
      message: "Please ensure all templates have content configured.",
    });
  }

  return errors;
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


