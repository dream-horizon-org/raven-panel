import { CreateJourneyFormData } from "../types/journey.interface";
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
    if (action.template) {
      const basePath = `nudgeSelection.actions.${i}.template` as Path<
        CreateJourneyFormData
      >;
      const isValid = validateTemplate(
        action.template,
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
  actions?: Array<{ template?: unknown }>
): Array<{ template?: unknown }> => {
  if (!actions) return [];

  return actions.filter((action) => {
    if (!action.template) return true;

    const template = action.template as {
      children?: unknown[];
      props?: Record<string, unknown>;
      styles?: Record<string, unknown>;
    };

    return !hasTemplateContent(template);
  });
};

export const validateEngagementsBeforeTabChange = (
  actions?: Array<{ template?: unknown }>
): { isValid: boolean; message?: string } => {
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
