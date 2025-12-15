import {
  isEmptyValue,
  getPropValue,
  isValidColor,
  isValidUrl,
  getStyleType,
  getStyleEnumValues,
<<<<<<< HEAD
} from "../app/dashboard/create/utils/validation";
=======
} from "../app/dashboard/create/utils/validation.utils.";
>>>>>>> 00f1f890a77e5ad8d210243937c6bb33c4d771c3

describe("validation utilities", () => {
  describe("isEmptyValue", () => {
    it("should return true for null", () => {
      expect(isEmptyValue(null)).toBe(true);
    });

    it("should return true for undefined", () => {
      expect(isEmptyValue(undefined)).toBe(true);
    });

    it("should return true for empty string", () => {
      expect(isEmptyValue("")).toBe(true);
    });

    it("should return true for whitespace-only string", () => {
      expect(isEmptyValue("   ")).toBe(true);
    });

    it("should return true for empty array", () => {
      expect(isEmptyValue([])).toBe(true);
    });

    it("should return false for non-empty string", () => {
      expect(isEmptyValue("hello")).toBe(false);
    });

    it("should return false for array with values", () => {
      expect(isEmptyValue([1, 2, 3])).toBe(false);
    });

    it("should handle array with object containing value property", () => {
      expect(isEmptyValue([{ value: "test" }])).toBe(false);
      expect(isEmptyValue([{ value: "" }])).toBe(true);
    });
  });

  describe("getPropValue", () => {
    it("should return first element from array", () => {
      expect(getPropValue([1, 2, 3])).toBe(1);
    });

    it("should extract value from object in array", () => {
      expect(getPropValue([{ value: "extracted" }])).toBe("extracted");
    });

    it("should return the value as-is if not an array", () => {
      expect(getPropValue("simple")).toBe("simple");
      expect(getPropValue(42)).toBe(42);
    });

    it("should handle empty array", () => {
      expect(getPropValue([])).toEqual([]);
    });
  });

  describe("isValidColor", () => {
    it("should return true for valid 6-digit hex color", () => {
      expect(isValidColor("#FFFFFF")).toBe(true);
      expect(isValidColor("#000000")).toBe(true);
      expect(isValidColor("#ff5733")).toBe(true);
    });

    it("should return true for valid 3-digit hex color", () => {
      expect(isValidColor("#FFF")).toBe(true);
      expect(isValidColor("#abc")).toBe(true);
    });

    it("should return false for invalid colors", () => {
      expect(isValidColor("red")).toBe(false);
      expect(isValidColor("rgb(255,0,0)")).toBe(false);
      expect(isValidColor("#GGGGGG")).toBe(false);
      expect(isValidColor("FFFFFF")).toBe(false);
    });

    it("should return false for empty or null values", () => {
      expect(isValidColor("")).toBe(false);
      expect(isValidColor((null as unknown) as string)).toBe(false);
      expect(isValidColor((undefined as unknown) as string)).toBe(false);
    });
  });

  describe("isValidUrl", () => {
    it("should return true for valid URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://localhost:3000")).toBe(true);
      expect(isValidUrl("https://api.dream11.com/v1/users")).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("example.com")).toBe(false);
      expect(isValidUrl("")).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isValidUrl((null as unknown) as string)).toBe(false);
      expect(isValidUrl((undefined as unknown) as string)).toBe(false);
    });
  });

  describe("getStyleType", () => {
    it('should return "color" for color-related styles', () => {
      expect(getStyleType("backgroundColor")).toBe("color");
      expect(getStyleType("color")).toBe("color");
      expect(getStyleType("borderColor")).toBe("color");
    });

    it('should return "enum" for layout-related styles', () => {
      expect(getStyleType("flexDirection")).toBe("enum");
      expect(getStyleType("justifyContent")).toBe("enum");
      expect(getStyleType("alignItems")).toBe("enum");
      expect(getStyleType("textAlign")).toBe("enum");
    });

    it('should return "number" for other styles', () => {
      expect(getStyleType("padding")).toBe("number");
      expect(getStyleType("margin")).toBe("number");
      expect(getStyleType("width")).toBe("number");
    });
  });

  describe("getStyleEnumValues", () => {
    it("should return flex direction values", () => {
      expect(getStyleEnumValues("flexDirection")).toEqual([
        "row",
        "column",
        "row-reverse",
        "column-reverse",
      ]);
    });

    it("should return justify content values", () => {
      expect(getStyleEnumValues("justifyContent")).toEqual([
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
      ]);
    });

    it("should return align items values", () => {
      expect(getStyleEnumValues("alignItems")).toEqual([
        "flex-start",
        "flex-end",
        "center",
        "stretch",
        "baseline",
      ]);
    });

    it("should return text align values", () => {
      expect(getStyleEnumValues("textAlign")).toEqual([
        "left",
        "center",
        "right",
        "justify",
      ]);
    });

    it("should return undefined for unknown styles", () => {
      expect(getStyleEnumValues("padding")).toBeUndefined();
      expect(getStyleEnumValues("margin")).toBeUndefined();
    });
  });
});
