import {
  parseTemplateString,
  stringifyTemplate,
} from "../templateStringConversion.utils";
import { DynamicTextValueType } from "../../types/journey.interface";

describe("templateStringConversion.utils", () => {
  describe("parseTemplateString", () => {
    it("should parse simple template variable", () => {
      const result = parseTemplateString("Hello {{name}}!");

      expect(result).toEqual([
        { isTemplateString: false, value: "Hello " },
        {
          isTemplateString: true,
          variableName: "name",
          default: "",
          variableType: "string",
        },
        { isTemplateString: false, value: "!" },
      ]);
    });

    it("should parse template variable with default value in quotes", () => {
      const result = parseTemplateString('{{name;default:"Guest"}}');

      expect(result).toEqual([
        {
          isTemplateString: true,
          variableName: "name",
          default: "Guest",
          variableType: "string",
        },
      ]);
    });

    it("should parse template variable with default value without quotes", () => {
      const result = parseTemplateString("{{count;default:0}}");

      expect(result).toEqual([
        {
          isTemplateString: true,
          variableName: "count",
          default: "0",
          variableType: "string",
        },
      ]);
    });

    it("should parse multiple template variables", () => {
      const result = parseTemplateString("{{greeting}} {{name}}, you have {{count}} messages");

      expect(result.length).toBe(6);
      expect(result[0]).toMatchObject({ isTemplateString: true, variableName: "greeting" });
      expect(result[1]).toMatchObject({ isTemplateString: false, value: " " });
      expect(result[2]).toMatchObject({ isTemplateString: true, variableName: "name" });
    });

    it("should handle empty template variable", () => {
      const result = parseTemplateString("Hello {{}}!");

      expect(result).toEqual([
        { isTemplateString: false, value: "Hello " },
        {
          isTemplateString: true,
          variableName: "",
          default: "",
          variableType: "string",
        },
        { isTemplateString: false, value: "!" },
      ]);
    });

    it("should handle text with no template variables", () => {
      const result = parseTemplateString("Hello World!");

      expect(result).toEqual([
        { isTemplateString: false, value: "Hello World!" },
      ]);
    });

    it("should handle empty string", () => {
      const result = parseTemplateString("");

      expect(result).toEqual([]);
    });

    it("should preserve whitespace between variables", () => {
      const result = parseTemplateString("{{first}}  {{second}}");

      expect(result[1]).toEqual({ isTemplateString: false, value: "  " });
    });

    it("should handle single quotes in default value", () => {
      const result = parseTemplateString("{{name;default:'Guest'}}");

      expect(result[0]).toMatchObject({
        isTemplateString: true,
        variableName: "name",
        default: "Guest",
      });
    });

    it("should handle template variable at start", () => {
      const result = parseTemplateString("{{name}} is here");

      expect(result[0]).toMatchObject({ isTemplateString: true, variableName: "name" });
      expect(result[1]).toMatchObject({ isTemplateString: false, value: " is here" });
    });

    it("should handle template variable at end", () => {
      const result = parseTemplateString("Hello {{name}}");

      expect(result[0]).toMatchObject({ isTemplateString: false, value: "Hello " });
      expect(result[1]).toMatchObject({ isTemplateString: true, variableName: "name" });
    });

    it("should handle consecutive template variables", () => {
      const result = parseTemplateString("{{first}}{{second}}");

      expect(result.length).toBe(2);
      expect(result[0]).toMatchObject({ isTemplateString: true, variableName: "first" });
      expect(result[1]).toMatchObject({ isTemplateString: true, variableName: "second" });
    });

    it("should trim whitespace from variable names", () => {
      const result = parseTemplateString("{{ name }}");

      expect(result[0]).toMatchObject({
        isTemplateString: true,
        variableName: "name",
      });
    });

    it("should handle empty default value", () => {
      const result = parseTemplateString('{{name;default:""}}');

      expect(result[0]).toMatchObject({
        isTemplateString: true,
        variableName: "name",
        default: "",
      });
    });
  });

  describe("stringifyTemplate", () => {
    it("should stringify simple template", () => {
      const value: DynamicTextValueType = [
        { isTemplateString: false, value: "Hello " },
        {
          isTemplateString: true,
          variableName: "name",
          default: "",
          variableType: "string",
        },
      ];

      const result = stringifyTemplate(value);

      expect(result).toBe('Hello {{name;default:""}}');
    });

    it("should stringify template with default value", () => {
      const value: DynamicTextValueType = [
        {
          isTemplateString: true,
          variableName: "name",
          default: "Guest",
          variableType: "string",
        },
      ];

      const result = stringifyTemplate(value);

      expect(result).toBe('{{name;default:"Guest"}}');
    });

    it("should stringify template with numeric default", () => {
      const value: DynamicTextValueType = [
        {
          isTemplateString: true,
          variableName: "count",
          default: 5,
          variableType: "string",
        },
      ];

      const result = stringifyTemplate(value);

      expect(result).toBe('{{count;default:"5"}}');
    });

    it("should stringify template with boolean default", () => {
      const value: DynamicTextValueType = [
        {
          isTemplateString: true,
          variableName: "isActive",
          default: true,
          variableType: "string",
        },
      ];

      const result = stringifyTemplate(value);

      expect(result).toBe('{{isActive;default:"true"}}');
    });

    it("should stringify multiple template variables", () => {
      const value: DynamicTextValueType = [
        {
          isTemplateString: true,
          variableName: "greeting",
          default: "Hello",
          variableType: "string",
        },
        { isTemplateString: false, value: " " },
        {
          isTemplateString: true,
          variableName: "name",
          default: "Guest",
          variableType: "string",
        },
      ];

      const result = stringifyTemplate(value);

      expect(result).toBe('{{greeting;default:"Hello"}} {{name;default:"Guest"}}');
    });

    it("should handle empty array", () => {
      const result = stringifyTemplate([]);

      expect(result).toBe("");
    });

    it("should handle undefined value", () => {
      const result = stringifyTemplate(undefined);

      expect(result).toBe("");
    });

    it("should handle null default value", () => {
      const value: DynamicTextValueType = [
        {
          isTemplateString: true,
          variableName: "name",
          default: null as any,
          variableType: "string",
        },
      ];

      const result = stringifyTemplate(value);

      expect(result).toBe('{{name;default:""}}');
    });

    it("should handle undefined default value", () => {
      const value: DynamicTextValueType = [
        {
          isTemplateString: true,
          variableName: "name",
          default: undefined as any,
          variableType: "string",
        },
      ];

      const result = stringifyTemplate(value);

      expect(result).toBe('{{name;default:""}}');
    });
  });

  describe("round-trip conversion", () => {
    it("should maintain data through parse and stringify", () => {
      const original = 'Hello {{name;default:"Guest"}}, you have {{count;default:"0"}} messages';

      const parsed = parseTemplateString(original);
      const stringified = stringifyTemplate(parsed);

      expect(stringified).toBe(original);
    });

    it("should handle complex template with multiple variables", () => {
      const original = '{{greeting;default:"Hi"}} {{firstName;default:""}} {{lastName;default:""}}, welcome back!';

      const parsed = parseTemplateString(original);
      const stringified = stringifyTemplate(parsed);

      expect(stringified).toBe(original);
    });
  });
});

