import {
  textToPartsArray,
  isTemplateVariable,
  splitTemplateVariable,
} from "../templateStringParsing.utils";

describe("templateStringParsing.utils", () => {
  describe("textToPartsArray", () => {
    it("should split text with template variables correctly", () => {
      const text = "Hello {{name}}!";
      const result = textToPartsArray(text);

      expect(result).toEqual(["Hello ", "{{name}}", "!"]);
    });

    it("should handle multiple template variables", () => {
      const text = "{{greeting}} {{name}}, you have {{count}} messages";
      const result = textToPartsArray(text);

      expect(result).toEqual([
        "{{greeting}}",
        " ",
        "{{name}}",
        ", you have ",
        "{{count}}",
        " messages",
      ]);
    });

    it("should handle text with no template variables", () => {
      const text = "Hello World!";
      const result = textToPartsArray(text);

      expect(result).toEqual(["Hello World!"]);
    });

    it("should handle empty template variables", () => {
      const text = "Hello {{}}!";
      const result = textToPartsArray(text);

      expect(result).toEqual(["Hello ", "{{}}", "!"]);
    });

    it("should handle text starting with template variable", () => {
      const text = "{{name}} is here";
      const result = textToPartsArray(text);

      expect(result).toEqual(["{{name}}", " is here"]);
    });

    it("should handle text ending with template variable", () => {
      const text = "Hello {{name}}";
      const result = textToPartsArray(text);

      expect(result).toEqual(["Hello ", "{{name}}"]);
    });

    it("should return empty array for empty string", () => {
      const text = "";
      const result = textToPartsArray(text);

      expect(result).toEqual([]);
    });

    it("should handle template variables with default values", () => {
      const text = 'Hello {{name;default:"Guest"}}!';
      const result = textToPartsArray(text);

      expect(result).toEqual(["Hello ", '{{name;default:"Guest"}}', "!"]);
    });

    it("should handle consecutive template variables", () => {
      const text = "{{first}}{{second}}";
      const result = textToPartsArray(text);

      expect(result).toEqual(["{{first}}", "{{second}}"]);
    });
  });

  describe("isTemplateVariable", () => {
    it("should return true for valid template variable", () => {
      expect(isTemplateVariable("{{name}}")).toBe(true);
    });

    it("should return true for empty template variable", () => {
      expect(isTemplateVariable("{{}}")).toBe(true);
    });

    it("should return true for template variable with default", () => {
      expect(isTemplateVariable('{{name;default:"value"}}')).toBe(true);
    });

    it("should return false for text without braces", () => {
      expect(isTemplateVariable("name")).toBe(false);
    });

    it("should return false for text with only opening braces", () => {
      expect(isTemplateVariable("{{name")).toBe(false);
    });

    it("should return false for text with only closing braces", () => {
      expect(isTemplateVariable("name}}")).toBe(false);
    });

    it("should return false for text with single braces", () => {
      expect(isTemplateVariable("{name}")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(isTemplateVariable("")).toBe(false);
    });
  });

  describe("splitTemplateVariable", () => {
    it("should split valid template variable correctly", () => {
      const result = splitTemplateVariable("{{name}}");

      expect(result).toEqual({
        open: "{{",
        content: "name",
        close: "}}",
      });
    });

    it("should split empty template variable", () => {
      const result = splitTemplateVariable("{{}}");

      expect(result).toEqual({
        open: "{{",
        content: "",
        close: "}}",
      });
    });

    it("should split template variable with default value", () => {
      const result = splitTemplateVariable('{{name;default:"Guest"}}');

      expect(result).toEqual({
        open: "{{",
        content: 'name;default:"Guest"',
        close: "}}",
      });
    });

    it("should handle non-template string", () => {
      const result = splitTemplateVariable("hello");

      expect(result).toEqual({
        open: "",
        content: "hello",
        close: "",
      });
    });

    it("should handle string with single braces", () => {
      const result = splitTemplateVariable("{name}");

      expect(result).toEqual({
        open: "",
        content: "{name}",
        close: "",
      });
    });

    it("should handle complex template content", () => {
      const result = splitTemplateVariable("{{user.profile.name}}");

      expect(result).toEqual({
        open: "{{",
        content: "user.profile.name",
        close: "}}",
      });
    });
  });
});

