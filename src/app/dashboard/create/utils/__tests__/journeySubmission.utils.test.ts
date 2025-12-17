import { submitJourney } from "../journeySubmission.utils";
import { validateSchedule } from "../scheduleValidation.utils";
import { validateTemplates } from "../templateValidation.utils";
import { createOrUpdateJourney } from "../journeyOperations.utils";
import { updateJourneyStatusBasedOnSchedule } from "../journeyStatus.utils";
import { CreateJourneyFormData } from "../../types/journey.interface";
import { toast } from "sonner";
import { AxiosError } from "axios";

jest.mock("../scheduleValidation.utils");
jest.mock("../templateValidation.utils");
jest.mock("../journeyOperations.utils");
jest.mock("../journeyStatus.utils");
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("journeySubmission.utils", () => {
  const mockSetError = jest.fn();
  const mockClearErrors = jest.fn();
  const mockSetIsSubmitting = jest.fn();
  const mockOnSuccess = jest.fn();
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const mockData: CreateJourneyFormData = {
    schedule: {},
    nudgeSelection: {
      actions: [],
    },
  } as any;

  const mockParams = {
    data: mockData,
    errors: {},
    setError: mockSetError,
    clearErrors: mockClearErrors,
    setIsSubmitting: mockSetIsSubmitting,
    onSuccess: mockOnSuccess,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return early when schedule validation fails", async () => {
    (validateSchedule as jest.Mock).mockReturnValue(false);

    await submitJourney(mockParams);

    expect(validateSchedule).toHaveBeenCalled();
    expect(validateTemplates).not.toHaveBeenCalled();
    expect(createOrUpdateJourney).not.toHaveBeenCalled();
    expect(mockSetIsSubmitting).not.toHaveBeenCalled();
  });

  it("should return early when template validation fails", async () => {
    (validateSchedule as jest.Mock).mockReturnValue(true);
    (validateTemplates as jest.Mock).mockReturnValue(false);

    await submitJourney(mockParams);

    expect(validateSchedule).toHaveBeenCalled();
    expect(validateTemplates).toHaveBeenCalled();
    expect(createOrUpdateJourney).not.toHaveBeenCalled();
  });

  it("should create journey and update status successfully", async () => {
    (validateSchedule as jest.Mock).mockReturnValue(true);
    (validateTemplates as jest.Mock).mockReturnValue(true);
    (createOrUpdateJourney as jest.Mock).mockResolvedValue(123);
    (updateJourneyStatusBasedOnSchedule as jest.Mock).mockResolvedValue(true);

    const searchParams = new URLSearchParams("?status=draft");
    await submitJourney({
      ...mockParams,
      searchParams,
    });

    expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
    expect(createOrUpdateJourney).toHaveBeenCalled();
    expect(updateJourneyStatusBasedOnSchedule).toHaveBeenCalledWith({
      journeyId: 123,
      data: mockData,
    });
    expect(mockOnSuccess).toHaveBeenCalledWith("draft");
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });

  it("should handle case when journeyId is null", async () => {
    (validateSchedule as jest.Mock).mockReturnValue(true);
    (validateTemplates as jest.Mock).mockReturnValue(true);
    (createOrUpdateJourney as jest.Mock).mockResolvedValue(null);

    await submitJourney(mockParams);

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(updateJourneyStatusBasedOnSchedule).not.toHaveBeenCalled();
  });

  it("should handle error during journey creation", async () => {
    (validateSchedule as jest.Mock).mockReturnValue(true);
    (validateTemplates as jest.Mock).mockReturnValue(true);
    const error = new AxiosError("Create failed");
    error.response = {
      data: {
        error: {
          message: "Error message",
        },
      },
    } as any;
    (createOrUpdateJourney as jest.Mock).mockRejectedValue(error);

    await submitJourney(mockParams);

    expect(toast.error).toHaveBeenCalledWith("Error message");
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });

  it("should handle error without response data", async () => {
    (validateSchedule as jest.Mock).mockReturnValue(true);
    (validateTemplates as jest.Mock).mockReturnValue(true);
    const error = new AxiosError("Network error");
    (createOrUpdateJourney as jest.Mock).mockRejectedValue(error);

    await submitJourney(mockParams);

    expect(toast.error).toHaveBeenCalled();
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });

  it("should call onSuccess with status param from searchParams", async () => {
    (validateSchedule as jest.Mock).mockReturnValue(true);
    (validateTemplates as jest.Mock).mockReturnValue(true);
    (createOrUpdateJourney as jest.Mock).mockResolvedValue(123);
    (updateJourneyStatusBasedOnSchedule as jest.Mock).mockResolvedValue(true);

    const searchParams = new URLSearchParams("?status=live");
    await submitJourney({
      ...mockParams,
      searchParams,
    });

    expect(mockOnSuccess).toHaveBeenCalledWith("live");
  });

  it("should call onSuccess with null when no status param", async () => {
    (validateSchedule as jest.Mock).mockReturnValue(true);
    (validateTemplates as jest.Mock).mockReturnValue(true);
    (createOrUpdateJourney as jest.Mock).mockResolvedValue(123);
    (updateJourneyStatusBasedOnSchedule as jest.Mock).mockResolvedValue(true);

    await submitJourney(mockParams);

    expect(mockOnSuccess).toHaveBeenCalledWith(null);
  });

  it("should handle update journey scenario", async () => {
    (validateSchedule as jest.Mock).mockReturnValue(true);
    (validateTemplates as jest.Mock).mockReturnValue(true);
    (createOrUpdateJourney as jest.Mock).mockResolvedValue(456);
    (updateJourneyStatusBasedOnSchedule as jest.Mock).mockResolvedValue(true);

    await submitJourney({
      ...mockParams,
      journeyId: "456",
      isCloneMode: false,
    });

    expect(createOrUpdateJourney).toHaveBeenCalledWith({
      data: mockData,
      journeyId: "456",
      isCloneMode: false,
    });
  });
});
