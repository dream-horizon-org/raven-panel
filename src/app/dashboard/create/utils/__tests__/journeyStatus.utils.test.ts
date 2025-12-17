import { updateJourneyStatusBasedOnSchedule } from "../journeyStatus.utils";
import { updateJourneyStatus } from "@/api/services/journeyStatus.service";
import { CreateJourneyFormData } from "../../types/journey.interface";
import { toast } from "sonner";
import { AxiosError } from "axios";

jest.mock("@/api/services/journeyStatus.service");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("journeyStatus.utils", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("updateJourneyStatusBasedOnSchedule", () => {
    it("should update status to live when enableImmediateStart is true", async () => {
      (updateJourneyStatus as jest.Mock).mockResolvedValue(undefined);
      const data: CreateJourneyFormData = {
        schedule: {
          enableImmediateStart: true,
        },
      } as any;

      const result = await updateJourneyStatusBasedOnSchedule({
        journeyId: 1,
        data,
      });

      expect(updateJourneyStatus).toHaveBeenCalledWith(1, "live");
      expect(toast.success).toHaveBeenCalledWith("Journey is now live!");
      expect(result).toBe(true);
    });

    it("should update status to schedule when enableScheduledStart is true", async () => {
      (updateJourneyStatus as jest.Mock).mockResolvedValue(undefined);
      const data: CreateJourneyFormData = {
        schedule: {
          enableScheduledStart: true,
        },
      } as any;

      const result = await updateJourneyStatusBasedOnSchedule({
        journeyId: 1,
        data,
      });

      expect(updateJourneyStatus).toHaveBeenCalledWith(1, "schedule");
      expect(toast.success).toHaveBeenCalledWith("Journey is now scheduled!");
      expect(result).toBe(true);
    });

    it("should return true when neither immediate nor scheduled start is enabled", async () => {
      const data: CreateJourneyFormData = {
        schedule: {},
      } as any;

      const result = await updateJourneyStatusBasedOnSchedule({
        journeyId: 1,
        data,
      });

      expect(updateJourneyStatus).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should handle error when updating to live fails", async () => {
      const error = new AxiosError("Network error");
      (updateJourneyStatus as jest.Mock).mockRejectedValue(error);
      const data: CreateJourneyFormData = {
        schedule: {
          enableImmediateStart: true,
        },
      } as any;

      const result = await updateJourneyStatusBasedOnSchedule({
        journeyId: 1,
        data,
      });

      expect(toast.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it("should handle error with response data message", async () => {
      const error = new AxiosError("Error");
      error.response = {
        data: {
          error: {
            message: "Custom error message",
          },
        },
      } as any;
      (updateJourneyStatus as jest.Mock).mockRejectedValue(error);
      const data: CreateJourneyFormData = {
        schedule: {
          enableImmediateStart: true,
        },
      } as any;

      const result = await updateJourneyStatusBasedOnSchedule({
        journeyId: 1,
        data,
      });

      expect(toast.error).toHaveBeenCalledWith("Custom error message");
      expect(result).toBe(false);
    });
  });
});
