/**
 * Utility functions for syncing template variables with contextParams
 */

/**
 * Filters contextParams to keep only those that are still present in template variables
 * @param currentContextParams - Array of current context parameters with id and label
 * @param templateVariables - Set of template variable names extracted from templates
 * @returns Filtered array of contextParams that are still in use
 */
export function filterActiveContextParams(
  currentContextParams: Array<{ id: number; label: string }>,
  templateVariables: Set<string>
): Array<{ id: number; label: string }> {
  return currentContextParams.filter((param) => templateVariables.has(param.label));
}

/**
 * Finds template variables that are missing from the current contextParams
 * @param contextParams - Array of current context parameters
 * @param templateVariables - Set of all template variables
 * @returns Array of variable names that are missing
 */
export function findMissingVariables(
  contextParams: Array<{ id: number; label: string }>,
  templateVariables: Set<string>
): string[] {
  const existingLabels = new Set(contextParams.map((param) => param.label));
  return Array.from(templateVariables).filter((variable) => !existingLabels.has(variable));
}

/**
 * Merges updated contextParams with new missing variables
 * @param updatedParams - Filtered contextParams that are still in use
 * @param missingVariables - Array of variable names that need to be added
 * @returns Combined array of contextParams with new entries
 */
export function mergeContextParams(
  updatedParams: Array<{ id: number; label: string }>,
  missingVariables: string[]
): Array<{ id: number; label: string }> {
  return [
    ...updatedParams,
    ...missingVariables.map((variable, index) => ({
      id: Date.now() + index,
      label: variable,
    })),
  ];
}

