import { generateRandomJourneyName } from "../app/dashboard/create/utils/journey.utils";

describe("journeyUtils", () => {
  describe("generateRandomJourneyName", () => {
    it('should generate a name starting with "Journey "', () => {
      const name = generateRandomJourneyName();
      expect(name).toMatch(/^Journey \d+$/);
    });

    it("should generate a number between 1 and 999", () => {
      // Run multiple times to increase confidence
      for (let i = 0; i < 100; i++) {
        const name = generateRandomJourneyName();
        const match = name.match(/Journey (\d+)/);
        expect(match).not.toBeNull();

        const num = parseInt(match![1], 10);
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(999);
      }
    });

    it("should return a string", () => {
      const name = generateRandomJourneyName();
      expect(typeof name).toBe("string");
    });
  });
});
