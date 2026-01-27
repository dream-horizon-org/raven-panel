import {
  hasScheduleErrors,
} from "../formValidation.utils";


describe("formValidation.utils", () => {
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

    it("should return true when endTime has error", () => {
      const errors = {
        schedule: {
          endTime: { message: "Error" },
        },
      };
      expect(hasScheduleErrors(errors)).toBe(true);
    });

    it("should return false when no schedule errors", () => {
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

});
