import {
  getJourneyIcon,
  formatStatusLabel,
  formatDate,
} from "../Dashboard.utils";
import { JOURNEY_ICONS } from "@/lib/mockData";
import {
  STATUS_LABEL_MAP,
  DATE_FORMAT_OPTIONS,
  DATE_LOCALE,
  DEFAULT_VALUES,
} from "../DashboardConstants";

describe("Dashboard.utils", () => {
  describe("getJourneyIcon", () => {
    it("should return icon based on journeyId modulo", () => {
      const icon = getJourneyIcon(0);
      expect(JOURNEY_ICONS).toContain(icon);
    });

    it("should return correct icon for journeyId 1", () => {
      const icon = getJourneyIcon(1);
      expect(icon).toBe(JOURNEY_ICONS[1 % JOURNEY_ICONS.length]);
    });

    it("should return correct icon for journeyId equal to array length", () => {
      const icon = getJourneyIcon(JOURNEY_ICONS.length);
      expect(icon).toBe(JOURNEY_ICONS[0]);
    });

    it("should return correct icon for large journeyId", () => {
      const icon = getJourneyIcon(100);
      expect(icon).toBe(JOURNEY_ICONS[100 % JOURNEY_ICONS.length]);
    });
  });

  describe("formatStatusLabel", () => {
    it("should format uppercase status correctly", () => {
      expect(formatStatusLabel("DRAFT")).toBe(STATUS_LABEL_MAP.DRAFT);
      expect(formatStatusLabel("LIVE")).toBe(STATUS_LABEL_MAP.LIVE);
      expect(formatStatusLabel("SCHEDULED")).toBe(STATUS_LABEL_MAP.SCHEDULED);
    });

    it("should format lowercase status correctly", () => {
      expect(formatStatusLabel("draft")).toBe(STATUS_LABEL_MAP.DRAFT);
      expect(formatStatusLabel("live")).toBe(STATUS_LABEL_MAP.LIVE);
    });

    it("should format mixed case status correctly", () => {
      expect(formatStatusLabel("Draft")).toBe(STATUS_LABEL_MAP.DRAFT);
      expect(formatStatusLabel("Live")).toBe(STATUS_LABEL_MAP.LIVE);
    });

    it("should return original status if not in map", () => {
      expect(formatStatusLabel("UNKNOWN")).toBe("UNKNOWN");
      expect(formatStatusLabel("custom-status")).toBe("custom-status");
    });
  });

  describe("formatDate", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should format valid timestamp correctly", () => {
      const timestamp = new Date("2024-01-15").getTime();
      const formatted = formatDate(timestamp);
      const expected = new Date(timestamp).toLocaleDateString(
        DATE_LOCALE,
        DATE_FORMAT_OPTIONS
      );
      expect(formatted).toBe(expected);
    });

    it("should return default empty date for null timestamp", () => {
      expect(formatDate(null as any)).toBe(DEFAULT_VALUES.emptyDate);
    });

    it("should return default empty date for undefined timestamp", () => {
      expect(formatDate(undefined as any)).toBe(DEFAULT_VALUES.emptyDate);
    });

    it("should return default empty date for 0 timestamp", () => {
      expect(formatDate(0)).toBe(DEFAULT_VALUES.emptyDate);
    });

    it("should format date with correct locale and options", () => {
      const timestamp = new Date("2024-12-25").getTime();
      const formatted = formatDate(timestamp);
      const expected = new Date(timestamp).toLocaleDateString(
        DATE_LOCALE,
        DATE_FORMAT_OPTIONS
      );
      expect(formatted).toBe(expected);
    });
  });
});
