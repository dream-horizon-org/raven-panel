import {
  validateScheduledStart,
  validateScheduledEnd,
  hasScheduleErrors,
  validateSchedule,
} from "../scheduleValidation.utils";
import { CreateJourneyFormData } from "../../types/journey.interface";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("scheduleValidation.utils", () => {
  const mockSetError = jest.fn();
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-15T10:00:00Z"));
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    consoleErrorSpy.mockRestore();
  });

  describe("validateScheduledStart", () => {
    it("should return true when scheduled start is disabled", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledStart: false,
        },
      } as any;
      expect(
        validateScheduledStart({ data, errors: {}, setError: mockSetError })
      ).toBe(true);
    });

    it("should return false when start date is missing", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledStart: true,
          startTime: "12:00",
        },
      } as any;
      expect(
        validateScheduledStart({ data, errors: {}, setError: mockSetError })
      ).toBe(false);
      expect(mockSetError).toHaveBeenCalledWith("schedule.startDate", {
        type: "required",
        message:
          "Start date is required when 'At specific date/time' is selected",
      });
      expect(toast.error).toHaveBeenCalled();
    });

    it("should return false when start time is missing", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledStart: true,
          startDate: "2024-01-20",
        },
      } as any;
      expect(
        validateScheduledStart({ data, errors: {}, setError: mockSetError })
      ).toBe(false);
      expect(mockSetError).toHaveBeenCalledWith("schedule.startTime", {
        type: "required",
        message:
          "Start time is required when 'At specific date/time' is selected",
      });
    });

    it("should return false when start date/time is in the past", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledStart: true,
          startDate: "2024-01-10",
          startTime: "09:00",
        },
      } as any;
      expect(
        validateScheduledStart({ data, errors: {}, setError: mockSetError })
      ).toBe(false);
      expect(mockSetError).toHaveBeenCalledWith("schedule.startDate", {
        type: "validation",
        message: "Start date and time cannot be in the past",
      });
      expect(toast.error).toHaveBeenCalledWith(
        "Start date and time cannot be in the past"
      );
    });

    it("should return true when start date/time is valid and in future", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledStart: true,
          startDate: "2024-01-20",
          startTime: "12:00",
        },
      } as any;
      expect(
        validateScheduledStart({ data, errors: {}, setError: mockSetError })
      ).toBe(true);
    });
  });

  describe("validateScheduledEnd", () => {
    it("should return true when scheduled end is disabled", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledEnd: false,
        },
      } as any;
      expect(
        validateScheduledEnd({ data, errors: {}, setError: mockSetError })
      ).toBe(true);
    });

    it("should return false when end date is missing", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledEnd: true,
          endTime: "18:00",
        },
      } as any;
      expect(
        validateScheduledEnd({ data, errors: {}, setError: mockSetError })
      ).toBe(false);
      expect(mockSetError).toHaveBeenCalledWith("schedule.endDate", {
        type: "required",
        message:
          "End date is required when 'At specific date/time' is selected",
      });
    });

    it("should return false when end time is missing", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledEnd: true,
          endDate: "2024-01-25",
        },
      } as any;
      expect(
        validateScheduledEnd({ data, errors: {}, setError: mockSetError })
      ).toBe(false);
    });

    it("should return false when end date/time is in the past", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledEnd: true,
          endDate: "2024-01-10",
          endTime: "09:00",
        },
      } as any;
      expect(
        validateScheduledEnd({ data, errors: {}, setError: mockSetError })
      ).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(
        "End date and time cannot be in the past"
      );
    });

    it("should return true when end date/time is valid and in future", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledEnd: true,
          endDate: "2024-01-25",
          endTime: "18:00",
        },
      } as any;
      expect(
        validateScheduledEnd({ data, errors: {}, setError: mockSetError })
      ).toBe(true);
    });
  });

  describe("hasScheduleErrors", () => {
    it("should return true when startDate has error", () => {
      const errors = {
        schedule: {
          startDate: { message: "Error" },
        },
      };
      expect(hasScheduleErrors(errors)).toBe(true);
    });

    it("should return true when startTime has error", () => {
      const errors = {
        schedule: {
          startTime: { message: "Error" },
        },
      };
      expect(hasScheduleErrors(errors)).toBe(true);
    });

    it("should return true when endDate has error", () => {
      const errors = {
        schedule: {
          endDate: { message: "Error" },
        },
      };
      expect(hasScheduleErrors(errors)).toBe(true);
    });

    it("should return false when no errors", () => {
      const errors = {
        schedule: {},
      };
      expect(hasScheduleErrors(errors)).toBe(false);
    });

    it("should return false when schedule is undefined", () => {
      const errors = {};
      expect(hasScheduleErrors(errors)).toBe(false);
    });
  });

  describe("validateSchedule", () => {
    it("should return true when all validations pass", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledStart: true,
          startDate: "2024-01-20",
          startTime: "12:00",
          enableScheduledEnd: true,
          endDate: "2024-01-25",
          endTime: "18:00",
        },
      } as any;
      const errors = {};
      expect(validateSchedule({ data, errors, setError: mockSetError })).toBe(
        true
      );
    });

    it("should return false when start validation fails", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledStart: true,
          startDate: "2024-01-10",
          startTime: "09:00",
        },
      } as any;
      const errors = {};
      expect(validateSchedule({ data, errors, setError: mockSetError })).toBe(
        false
      );
    });

    it("should return false when end validation fails", () => {
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledEnd: true,
          endDate: "2024-01-10",
          endTime: "09:00",
        },
      } as any;
      const errors = {};
      expect(validateSchedule({ data, errors, setError: mockSetError })).toBe(
        false
      );
    });

    it("should return false when hasScheduleErrors returns true", () => {
      const data: CreateJourneyFormData = {
        schedule: {},
      } as any;
      const errors = {
        schedule: {
          startDate: { message: "Error" },
        },
      };
      expect(validateSchedule({ data, errors, setError: mockSetError })).toBe(
        false
      );
      expect(toast.error).toHaveBeenCalledWith(
        "Please fix all schedule errors before creating/updating the journey."
      );
    });
  });
});
