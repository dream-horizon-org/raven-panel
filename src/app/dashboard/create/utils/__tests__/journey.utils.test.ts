import {
  generateRandomJourneyName,
  findMatchingEvent,
  createEventSelection,
} from "../journey.utils";
import { EventListItem } from "@/api/services/types/events.interface";

describe("journey.utils", () => {
  describe("generateRandomJourneyName", () => {
    it("should generate a journey name with random number", () => {
      const name = generateRandomJourneyName();
      expect(name).toMatch(/^Journey \d+$/);
    });

    it("should generate different names on multiple calls", () => {
      const names = Array.from({ length: 10 }, () =>
        generateRandomJourneyName()
      );
      const uniqueNames = new Set(names);
      // At least some should be different (not guaranteed but likely)
      expect(uniqueNames.size).toBeGreaterThan(1);
    });

    it("should generate number between 1 and 999", () => {
      const names = Array.from({ length: 100 }, () =>
        generateRandomJourneyName()
      );
      names.forEach((name) => {
        const match = name.match(/Journey (\d+)/);
        expect(match).not.toBeNull();
        const num = parseInt(match![1], 10);
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(999);
      });
    });
  });

  describe("findMatchingEvent", () => {
    const mockEventList: EventListItem[] = [
      {
        eventName: "event1",
        properties: [],
      } as EventListItem,
      {
        eventName: "event2",
        properties: [],
      } as EventListItem,
      {
        eventName: "event3",
        properties: [],
      } as EventListItem,
    ];

    it("should find matching event by name", () => {
      const result = findMatchingEvent("event2", mockEventList);
      expect(result).toBeDefined();
      expect(result?.eventName).toBe("event2");
    });

    it("should return undefined when event not found", () => {
      const result = findMatchingEvent("nonexistent", mockEventList);
      expect(result).toBeUndefined();
    });

    it("should handle empty event list", () => {
      const result = findMatchingEvent("event1", []);
      expect(result).toBeUndefined();
    });

    it("should be case sensitive", () => {
      const result = findMatchingEvent("EVENT1", mockEventList);
      expect(result).toBeUndefined();
    });
  });

  describe("createEventSelection", () => {
    const mockEventList: EventListItem[] = [
      {
        eventName: "event1",
        properties: [],
      } as EventListItem,
      {
        eventName: "event2",
        properties: [],
      } as EventListItem,
      {
        eventName: "event3",
        properties: [],
      } as EventListItem,
    ];

    it("should create event selection with correct id and label", () => {
      const matchingEvent = mockEventList[1];
      const result = createEventSelection(
        matchingEvent,
        mockEventList,
        "event2"
      );
      expect(result.id).toBe(2); // index + 1
      expect(result.label).toBe("event2");
    });

    it("should create event selection for first event", () => {
      const matchingEvent = mockEventList[0];
      const result = createEventSelection(
        matchingEvent,
        mockEventList,
        "event1"
      );
      expect(result.id).toBe(1);
      expect(result.label).toBe("event1");
    });

    it("should use provided eventName as label", () => {
      const matchingEvent = mockEventList[1];
      const result = createEventSelection(
        matchingEvent,
        mockEventList,
        "custom-name"
      );
      expect(result.label).toBe("custom-name");
      expect(result.id).toBe(2);
    });
  });
});
