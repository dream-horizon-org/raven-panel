import { createOrUpdateJourney } from "../journeyOperations.utils";
import { createJourney } from "@/api/services/createJourney.service";
import { updateJourney } from "@/api/services/updateJourney.service";
import { CreateJourneyFormData } from "../../types/journey.interface";
import { toast } from "sonner";
import { AxiosError } from "axios";

jest.mock("@/api/services/createJourney.service");
jest.mock("@/api/services/updateJourney.service");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("journeyOperations.utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrUpdateJourney", () => {
    const mockData: CreateJourneyFormData = {
      ctaMetadata: {
        ctaTitle: "Test Journey",
      },
    } as any;

    it("should update journey when journeyId is provided and not in clone mode", async () => {
      (updateJourney as jest.Mock).mockResolvedValue(undefined);

      const result = await createOrUpdateJourney({
        data: mockData,
        journeyId: "123",
        isCloneMode: false,
      });

      expect(updateJourney).toHaveBeenCalledWith(123, mockData);
      expect(createJourney).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Journey updated successfully!"
      );
      expect(result).toBe(123);
    });

    it("should create journey when journeyId is not provided", async () => {
      const mockResponse = { data: { id: 456 } };
      (createJourney as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createOrUpdateJourney({
        data: mockData,
      });

      expect(createJourney).toHaveBeenCalledWith(mockData);
      expect(updateJourney).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Journey created successfully!"
      );
      expect(result).toBe(456);
    });

    it("should create journey when in clone mode", async () => {
      const mockResponse = { data: { id: 789 } };
      (createJourney as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createOrUpdateJourney({
        data: mockData,
        journeyId: "123",
        isCloneMode: true,
      });

      expect(createJourney).toHaveBeenCalledWith(mockData);
      expect(updateJourney).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Journey cloned successfully!"
      );
      expect(result).toBe(789);
    });

    it("should handle response with numeric data", async () => {
      (createJourney as jest.Mock).mockResolvedValue(999);

      const result = await createOrUpdateJourney({
        data: mockData,
      });

      expect(result).toBe(999);
    });

    it("should handle response with data.id", async () => {
      const mockResponse = { data: { id: 111 } };
      (createJourney as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createOrUpdateJourney({
        data: mockData,
      });

      expect(result).toBe(111);
    });

    it("should handle response with numeric data property", async () => {
      const mockResponse = { data: 222 };
      (createJourney as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createOrUpdateJourney({
        data: mockData,
      });

      expect(result).toBe(222);
    });

    it("should handle response with id property", async () => {
      const mockResponse = { id: 333 };
      (createJourney as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createOrUpdateJourney({
        data: mockData,
      });

      expect(result).toBe(333);
    });

    it("should handle update error", async () => {
      const error = new AxiosError("Update failed");
      error.response = {
        data: {
          error: {
            message: "Update error message",
          },
        },
      } as any;
      (updateJourney as jest.Mock).mockRejectedValue(error);

      await expect(
        createOrUpdateJourney({
          data: mockData,
          journeyId: "123",
          isCloneMode: false,
        })
      ).rejects.toThrow();

      expect(toast.error).toHaveBeenCalledWith("Update error message");
    });

    it("should handle create error", async () => {
      const error = new AxiosError("Create failed");
      error.response = {
        data: {
          error: {
            message: "Create error message",
          },
        },
      } as any;
      (createJourney as jest.Mock).mockRejectedValue(error);

      await expect(
        createOrUpdateJourney({
          data: mockData,
        })
      ).rejects.toThrow();

      expect(toast.error).toHaveBeenCalledWith("Create error message");
    });
  });
});
