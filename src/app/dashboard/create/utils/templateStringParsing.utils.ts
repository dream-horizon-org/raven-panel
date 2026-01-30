/**
 * Utility functions for parsing and manipulating template strings
 */

/**
 * Splits text into parts: normal text and {{...}} template variables
 * @param text - The text to split
 * @returns Array of text parts, where template variables are preserved as whole strings
 * @example
 * textToPartsArray("Hello {{name}}!") // ["Hello ", "{{name}}", "!"]
 */
export function textToPartsArray(text: string): string[] {
  if (!text) return [];
  // This regex captures both the delimiters and the content between them
  return text.split(/(\{\{[^}]*\}\})/g).filter((part) => part !== "");
}

/**
 * Checks if a string is a template variable (starts with {{ and ends with }})
 * @param str - The string to check
 * @returns True if the string is a template variable
 * @example
 * isTemplateVariable("{{name}}") // true
 * isTemplateVariable("hello") // false
 */
export function isTemplateVariable(str: string): boolean {
  return str.startsWith("{{") && str.endsWith("}}");
}

/**
 * Splits a template variable into its component parts
 * @param template - The template string to split (must be a valid template like {{...}})
 * @returns Object with open braces, content, and close braces
 * @example
 * splitTemplateVariable("{{name}}") // { open: "{{", content: "name", close: "}}" }
 * splitTemplateVariable("hello") // { open: "", content: "hello", close: "" }
 */
export function splitTemplateVariable(template: string): {
  open: string;
  content: string;
  close: string;
} {
  if (!isTemplateVariable(template)) {
    return { open: "", content: template, close: "" };
  }
  return {
    open: "{{",
    content: template.slice(2, -2), // Remove {{ and }}
    close: "}}",
  };
}

