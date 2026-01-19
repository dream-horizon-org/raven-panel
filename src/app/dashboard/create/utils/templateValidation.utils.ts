import {
  CreateJourneyFormData,
  NudgeType,
  ReactNativeJson,
  NudgeEvent,
} from "../types/journey.interface";
import { Path } from "react-hook-form";
import { validateTemplate } from "./validation.utils.";
import { toast } from "sonner";
import { CheckTemplateErrorsParams } from "../types/JourneyNode.interface";

export const hasTemplate = (
  actions?: Array<{ template?: { type?: unknown } | unknown }>
): boolean => {
  return !!(
    actions &&
    actions.length > 0 &&
    actions.some(
      (action) =>
        action.template &&
        typeof action.template === "object" &&
        "type" in action.template &&
        action.template.type
    )
  );
};

interface TemplateValidationParams {
  data: CreateJourneyFormData;
  setError: (
    path: Path<CreateJourneyFormData>,
    error: { type: string; message: string }
  ) => void;
  clearErrors: (path: Path<CreateJourneyFormData>) => void;
}

export const validateActionsExist = (data: CreateJourneyFormData): boolean => {
  if (
    !data.nudgeSelection?.actions ||
    data.nudgeSelection.actions.length === 0
  ) {
    console.error("Error: No actions/templates configured");
    toast.error(
      "Please configure at least one engagement template before creating the journey."
    );
    return false;
  }
  return true;
};

export const validateAllActionsHaveTemplates = (
  data: CreateJourneyFormData
): boolean => {
  const actionsWithoutTemplate = data.nudgeSelection?.actions?.filter(
    (action) => !action.template
  );

  if (actionsWithoutTemplate && actionsWithoutTemplate.length > 0) {
    console.error("Error: Some actions are missing templates");
    toast.error(
      "Please ensure all actions have templates configured before creating the journey."
    );
    return false;
  }
  return true;
};

export const validateTemplateStructures = ({
  data,
  setError,
  clearErrors,
}: TemplateValidationParams): boolean => {
  if (!data.nudgeSelection?.actions) {
    return true;
  }

  let hasTemplateErrors = false;
  for (let i = 0; i < data.nudgeSelection.actions.length; i++) {
    const action = data.nudgeSelection.actions[i];

    if (action.type === NudgeType.NUDGE_ACTION) {
      continue;
    }
    if (action.template) {
      const basePath = `nudgeSelection.actions.${i}.template` as Path<
        CreateJourneyFormData
      >;
      // At this point, template is ReactNativeJson (not NudgeEvent) since we skipped NUDGE_ACTION
      const isValid = validateTemplate(
        action.template as ReactNativeJson,
        basePath,
        setError,
        clearErrors
      );
      if (!isValid) {
        hasTemplateErrors = true;
      }
    }
  }

  if (hasTemplateErrors) {
    console.error("Error: Template validation failed");
    toast.error("Please fix all template errors before creating the journey.");
    return false;
  }

  return true;
};

export const validateTemplates = (
  params: TemplateValidationParams
): boolean => {
  if (!validateActionsExist(params.data)) {
    return false;
  }

  if (!validateAllActionsHaveTemplates(params.data)) {
    return false;
  }

  if (!validateTemplateStructures(params)) {
    return false;
  }

  return true;
};

const checkForErrors = (obj: unknown): boolean => {
  if (!obj || typeof obj !== "object") return false;
  if ("message" in obj) return true;

  for (const key in obj) {
    if (checkForErrors((obj as Record<string, unknown>)[key])) return true;
  }
  return false;
};

export const hasTemplateErrors = ({
  formStateErrors,
  errors,
}: CheckTemplateErrorsParams): boolean => {
  const currentErrors =
    formStateErrors?.nudgeSelection?.actions || errors?.nudgeSelection?.actions;
  if (!currentErrors) return false;

  const actionsErrors = Array.isArray(currentErrors)
    ? currentErrors
    : currentErrors && typeof currentErrors === "object"
    ? [currentErrors]
    : [];

  if (actionsErrors.length === 0) return false;

  for (let i = 0; i < actionsErrors.length; i++) {
    const actionErrors = actionsErrors[i];
    if (!actionErrors || typeof actionErrors !== "object") continue;

    const templateErrorsPath = (actionErrors as Record<string, unknown>)
      .template;
    if (!templateErrorsPath) continue;

    if (checkForErrors(templateErrorsPath)) return true;
  }

  return false;
};

const hasTemplateContent = (template: {
  children?: unknown[];
  props?: Record<string, unknown>;
  styles?: Record<string, unknown>;
}): boolean => {
  return !!(
    (template.children && template.children.length > 0) ||
    (template.props && Object.keys(template.props).length > 1) ||
    (template.styles && Object.keys(template.styles).length > 0)
  );
};

export const getEngagementsWithoutTemplates = (
  actions?: Array<{ template?: unknown; type?: NudgeType }>
): Array<{ template?: unknown }> => {
  if (!actions) return [];

  return actions.filter((action) => {
    if (action.type === NudgeType.NUDGE_ACTION) {
      return false;
    }

    if (!action.template) return true;

    const template = action.template as {
      children?: unknown[];
      props?: Record<string, unknown>;
      styles?: Record<string, unknown>;
    };

    return !hasTemplateContent(template);
  });
};

const validateNudgeEventForTabChange = (
  nudgeEvent: NudgeEvent
): { isValid: boolean; message?: string } => {
  const missingFields: string[] = [];

  // Validate eventName
  if (!nudgeEvent.eventName || nudgeEvent.eventName.trim() === "") {
    missingFields.push("Event Name");
  }

  // Require at least one property if eventName is filled
  if (nudgeEvent.eventName && nudgeEvent.eventName.trim() !== "") {
    if (!nudgeEvent.eventParams || nudgeEvent.eventParams.length === 0) {
      missingFields.push("Event Property");
    }
  }

  // Validate eventParams if they exist
  if (nudgeEvent.eventParams && nudgeEvent.eventParams.length > 0) {
    const missingPropertyNames: number[] = [];
    const missingPropertyValues: number[] = [];

    for (let i = 0; i < nudgeEvent.eventParams.length; i++) {
      const param = nudgeEvent.eventParams[i];
      let paramHasError = false;
      let valueError = false;

      // Validate param name
      if (!param.name || param.name.trim() === "") {
        paramHasError = true;
        missingPropertyNames.push(i + 1);
      }

      // Validate param value
      if (!param.value || param.value.length === 0) {
        valueError = true;
        missingPropertyValues.push(i + 1);
      } else {
        const firstValue = param.value[0];
        if (!firstValue) {
          valueError = true;
          missingPropertyValues.push(i + 1);
        } else {
          // Check if it's a static type and has a value
          if (!firstValue.isTemplateString) {
            const staticValue = firstValue.value;
            if (
              staticValue === undefined ||
              staticValue === null ||
              String(staticValue).trim() === ""
            ) {
              valueError = true;
              missingPropertyValues.push(i + 1);
            }
          }
        }
      }
    }

    if (missingPropertyNames.length > 0) {
      missingFields.push(
        `Event Property name${
          missingPropertyNames.length > 1 ? "s" : ""
        } (Property ${missingPropertyNames.join(", ")})`
      );
    }
    if (missingPropertyValues.length > 0) {
      missingFields.push(
        `Event Property value${
          missingPropertyValues.length > 1 ? "s" : ""
        } (Property ${missingPropertyValues.join(", ")})`
      );
    }
  }

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Please fill in the following required fields for Emit System events: ${missingFields.join(
        ", "
      )}`,
    };
  }

  return { isValid: true };
};

export const validateEngagementsBeforeTabChange = (
  actions?: Array<{ template?: unknown; type?: NudgeType }>
): { isValid: boolean; message?: string } => {
  if (!actions || actions.length === 0) {
    return { isValid: true };
  }

  // Check for NUDGE_ACTION (Emit System events) engagements
  for (const action of actions) {
    if (action.type === NudgeType.NUDGE_ACTION) {
      if (!action.template) {
        return {
          isValid: false,
          message:
            "Please fill in Event Name and Event Property fields for Emit System events before proceeding to Journey Setup.",
        };
      }

      if (
        typeof action.template === "object" &&
        action.template !== null &&
        "eventName" in action.template
      ) {
        const validation = validateNudgeEventForTabChange(
          action.template as NudgeEvent
        );
        if (!validation.isValid) {
          return validation;
        }
      } else {
        return {
          isValid: false,
          message:
            "Please fill in Event Name and Event Property fields for Emit System events before proceeding to Journey Setup.",
        };
      }
    }
  }

  // Check for other engagement types (ReactNativeJson templates)
  const engagementsWithoutTemplates = getEngagementsWithoutTemplates(actions);

  if (engagementsWithoutTemplates.length > 0) {
    return {
      isValid: false,
      message:
        "Please add template details for all engagements before proceeding to Journey Setup.",
    };
  }

  return { isValid: true };
};
