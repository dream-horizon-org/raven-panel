import {
  isNumericType,
  isBooleanType,
  isStringType,
  getInputType,
  convertComparisonValue,
  normalizePropertyType,
  extractSystemProperties,
} from "../propertyType.utils";

describe("propertyType.utils", () => {
  describe("isNumericType", () => {
    it("should return true for numeric types", () => {
      expect(isNumericType("integer")).toBe(true);
      expect(isNumericType("long")).toBe(true);
      expect(isNumericType("double")).toBe(true);
      expect(isNumericType("decimal")).toBe(true);
      expect(isNumericType("float")).toBe(true);
    });

    it("should be case insensitive", () => {
      expect(isNumericType("INTEGER")).toBe(true);
      expect(isNumericType("Long")).toBe(true);
      expect(isNumericType("FLOAT")).toBe(true);
    });

    it("should return false for non-numeric types", () => {
      expect(isNumericType("string")).toBe(false);
      expect(isNumericType("boolean")).toBe(false);
      expect(isNumericType("number")).toBe(false);
      expect(isNumericType("int")).toBe(false);
      expect(isNumericType("unknown")).toBe(false);
    });
  });

  describe("isBooleanType", () => {
    it("should return true for boolean type", () => {
      expect(isBooleanType("boolean")).toBe(true);
      expect(isBooleanType("BOOLEAN")).toBe(true);
      expect(isBooleanType("Boolean")).toBe(true);
    });

    it("should return false for non-boolean types", () => {
      expect(isBooleanType("string")).toBe(false);
      expect(isBooleanType("number")).toBe(false);
    });
  });

  describe("isStringType", () => {
    it("should return true for string type", () => {
      expect(isStringType("string")).toBe(true);
      expect(isStringType("STRING")).toBe(true);
      expect(isStringType("String")).toBe(true);
    });

    it("should return false for non-string types", () => {
      expect(isStringType("number")).toBe(false);
      expect(isStringType("boolean")).toBe(false);
    });
  });

  describe("getInputType", () => {
    it("should return number for numeric types", () => {
      expect(getInputType("integer")).toBe("number");
      expect(getInputType("long")).toBe("number");
      expect(getInputType("float")).toBe("number");
      expect(getInputType("double")).toBe("number");
      expect(getInputType("decimal")).toBe("number");
    });

    it("should return select for boolean type", () => {
      expect(getInputType("boolean")).toBe("select");
    });

    it("should return text for string and other types", () => {
      expect(getInputType("string")).toBe("text");
      expect(getInputType("unknown")).toBe("text");
    });
  });

  describe("convertComparisonValue", () => {
    it("should convert string to number for numeric types", () => {
      expect(convertComparisonValue("123", "integer")).toBe(123);
      expect(convertComparisonValue("45.67", "float")).toBe(45.67);
    });

    it("should return number as-is for numeric types", () => {
      expect(convertComparisonValue(123, "integer")).toBe(123);
      expect(convertComparisonValue(45.67, "float")).toBe(45.67);
    });

    it("should return original value for invalid numeric string", () => {
      expect(convertComparisonValue("abc", "number")).toBe("abc");
    });

    it("should convert number to string for non-numeric types", () => {
      expect(convertComparisonValue(123, "string")).toBe("123");
      expect(convertComparisonValue(45.67, "boolean")).toBe("45.67");
    });

    it("should return string as-is for non-numeric types", () => {
      expect(convertComparisonValue("test", "string")).toBe("test");
    });
  });

  describe("normalizePropertyType", () => {
    it("should normalize numeric types to number", () => {
      expect(normalizePropertyType("integer")).toBe("number");
      expect(normalizePropertyType("long")).toBe("number");
      expect(normalizePropertyType("float")).toBe("number");
      expect(normalizePropertyType("double")).toBe("number");
      expect(normalizePropertyType("decimal")).toBe("number");
    });

    it("should normalize boolean type", () => {
      expect(normalizePropertyType("boolean")).toBe("boolean");
    });

    it("should normalize string and other types to string", () => {
      expect(normalizePropertyType("string")).toBe("string");
      expect(normalizePropertyType("unknown")).toBe("string");
    });

    it("should be case insensitive", () => {
      expect(normalizePropertyType("INTEGER")).toBe("number");
      expect(normalizePropertyType("BOOLEAN")).toBe("boolean");
      expect(normalizePropertyType("STRING")).toBe("string");
    });
  });

  describe("extractSystemProperties", () => {
    it("should extract properties from array format", () => {
      const data = {
        data: [
          { propertyName: "prop1", type: "string" },
          { propertyName: "prop2", type: "number" },
          { propertyName: "prop3" },
        ],
      };
      const result = extractSystemProperties(data);
      expect(result.systemPropertyNames).toEqual(["prop1", "prop2", "prop3"]);
      expect(result.systemPropertyTypes.get("prop1")).toBe("string");
      expect(result.systemPropertyTypes.get("prop2")).toBe("number");
    });

    it("should extract properties from names array", () => {
      const data = {
        data: {
          names: ["prop1", "prop2", "prop3"],
        },
      };
      const result = extractSystemProperties(data);
      expect(result.systemPropertyNames).toEqual(["prop1", "prop2", "prop3"]);
    });

    it("should extract properties from properties array", () => {
      const data = {
        data: {
          properties: [
            "prop1",
            { propertyName: "prop2", type: "number" },
            { propertyName: "prop3" },
          ],
        },
      };
      const result = extractSystemProperties(data);
      expect(result.systemPropertyNames).toEqual(["prop1", "prop2", "prop3"]);
      expect(result.systemPropertyTypes.get("prop2")).toBe("number");
    });

    it("should extract properties from systemProperties array", () => {
      const data = {
        data: {
          systemProperties: [
            "prop1",
            { propertyName: "prop2", type: "boolean" },
          ],
        },
      };
      const result = extractSystemProperties(data);
      expect(result.systemPropertyNames).toEqual(["prop1", "prop2"]);
      expect(result.systemPropertyTypes.get("prop2")).toBe("boolean");
    });

    it("should return empty arrays for null/undefined data", () => {
      expect(extractSystemProperties(null)).toEqual({
        systemPropertyNames: [],
        systemPropertyTypes: new Map(),
      });
      expect(extractSystemProperties(undefined)).toEqual({
        systemPropertyNames: [],
        systemPropertyTypes: new Map(),
      });
    });

    it("should return empty arrays when data.data is undefined", () => {
      const result = extractSystemProperties({ data: undefined });
      expect(result.systemPropertyNames).toEqual([]);
      expect(result.systemPropertyTypes.size).toBe(0);
    });
  });
});
