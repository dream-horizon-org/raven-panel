import {
  filterActiveContextParams,
  findMissingVariables,
  mergeContextParams,
} from "../contextParamsSync.utils";

describe("contextParamsSync.utils", () => {
  describe("filterActiveContextParams", () => {
    it("should filter out contextParams that are not in templateVariables", () => {
      const currentContextParams = [
        { id: 1, label: "userId" },
        { id: 2, label: "userName" },
        { id: 3, label: "oldParam" },
      ];
      const templateVariables = new Set(["userId", "userName"]);

      const result = filterActiveContextParams(currentContextParams, templateVariables);

      expect(result).toEqual([
        { id: 1, label: "userId" },
        { id: 2, label: "userName" },
      ]);
    });

    it("should return empty array when no params match", () => {
      const currentContextParams = [
        { id: 1, label: "oldParam1" },
        { id: 2, label: "oldParam2" },
      ];
      const templateVariables = new Set(["newParam"]);

      const result = filterActiveContextParams(currentContextParams, templateVariables);

      expect(result).toEqual([]);
    });

    it("should return all params when all are in templateVariables", () => {
      const currentContextParams = [
        { id: 1, label: "userId" },
        { id: 2, label: "userName" },
      ];
      const templateVariables = new Set(["userId", "userName"]);

      const result = filterActiveContextParams(currentContextParams, templateVariables);

      expect(result).toEqual(currentContextParams);
    });

    it("should handle empty currentContextParams", () => {
      const currentContextParams: Array<{ id: number; label: string }> = [];
      const templateVariables = new Set(["userId"]);

      const result = filterActiveContextParams(currentContextParams, templateVariables);

      expect(result).toEqual([]);
    });
  });

  describe("findMissingVariables", () => {
    it("should find variables that are missing from contextParams", () => {
      const contextParams = [
        { id: 1, label: "userId" },
        { id: 2, label: "userName" },
      ];
      const templateVariables = new Set(["userId", "userName", "userEmail", "userPhone"]);

      const result = findMissingVariables(contextParams, templateVariables);

      expect(result).toEqual(expect.arrayContaining(["userEmail", "userPhone"]));
      expect(result.length).toBe(2);
    });

    it("should return empty array when no variables are missing", () => {
      const contextParams = [
        { id: 1, label: "userId" },
        { id: 2, label: "userName" },
      ];
      const templateVariables = new Set(["userId", "userName"]);

      const result = findMissingVariables(contextParams, templateVariables);

      expect(result).toEqual([]);
    });

    it("should return all template variables when contextParams is empty", () => {
      const contextParams: Array<{ id: number; label: string }> = [];
      const templateVariables = new Set(["userId", "userName"]);

      const result = findMissingVariables(contextParams, templateVariables);

      expect(result).toEqual(expect.arrayContaining(["userId", "userName"]));
      expect(result.length).toBe(2);
    });

    it("should handle empty templateVariables", () => {
      const contextParams = [{ id: 1, label: "userId" }];
      const templateVariables = new Set<string>();

      const result = findMissingVariables(contextParams, templateVariables);

      expect(result).toEqual([]);
    });
  });

  describe("mergeContextParams", () => {
    it("should merge updated params with missing variables", () => {
      const updatedParams = [
        { id: 1, label: "userId" },
        { id: 2, label: "userName" },
      ];
      const missingVariables = ["userEmail", "userPhone"];

      const result = mergeContextParams(updatedParams, missingVariables);

      expect(result.length).toBe(4);
      expect(result.slice(0, 2)).toEqual(updatedParams);
      expect(result[2].label).toBe("userEmail");
      expect(result[3].label).toBe("userPhone");
      expect(typeof result[2].id).toBe("number");
      expect(typeof result[3].id).toBe("number");
    });

    it("should return only updated params when no missing variables", () => {
      const updatedParams = [
        { id: 1, label: "userId" },
        { id: 2, label: "userName" },
      ];
      const missingVariables: string[] = [];

      const result = mergeContextParams(updatedParams, missingVariables);

      expect(result).toEqual(updatedParams);
    });

    it("should return only new variables when updatedParams is empty", () => {
      const updatedParams: Array<{ id: number; label: string }> = [];
      const missingVariables = ["userId", "userName"];

      const result = mergeContextParams(updatedParams, missingVariables);

      expect(result.length).toBe(2);
      expect(result[0].label).toBe("userId");
      expect(result[1].label).toBe("userName");
    });

    it("should assign unique IDs to new variables", () => {
      const updatedParams: Array<{ id: number; label: string }> = [];
      const missingVariables = ["var1", "var2", "var3"];

      const result = mergeContextParams(updatedParams, missingVariables);

      const ids = result.map((param) => param.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3); // All IDs should be unique
    });
  });
});

