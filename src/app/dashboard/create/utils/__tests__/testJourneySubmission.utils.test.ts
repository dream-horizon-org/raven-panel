import { submitTestJourney } from "../testJourneySubmission.utils";
import { CreateJourneyFormData } from "../../types/journey.interface";
import { transformFormDataToTestApiFormat } from "../testJourney.utils";
import { AxiosError } from "axios";
import { toast } from "sonner";

jest.mock("../testJourney.utils");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("testJourneySubmission.utils", () => {
  const mockSetError = jest.fn();
  const mockClearErrors = jest.fn();
  const mockSetValue = jest.fn();
  const mockOnSuccess = jest.fn();
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const mockFormData: CreateJourneyFormData = {
    testFeature: {
      isTestFeatureEnabled: true,
      userIds: "123,456",
      expireInMins: 30,
      prevCtaId: "",
    },
    nudgeSelection: {
      actions: [],
    },
  } as any;

  const mockMutation = {
    mutateAsync: jest.fn(),
  } as any;

  const mockParams = {
    formData: mockFormData,
    setError: mockSetError,
    clearErrors: mockClearErrors,
    setValue: mockSetValue,
    mutation: mockMutation,
    onSuccess: mockOnSuccess,
  };

  it("should successfully submit test journey", async () => {
    (transformFormDataToTestApiFormat as jest.Mock).mockReturnValue({
      userIds: [123, 456],
      expiresInMinutes: 30,
      rule: {},
    });
    mockMutation.mutateAsync.mockResolvedValue({ data: 999 });

    await submitTestJourney(mockParams);

    expect(mockClearErrors).toHaveBeenCalled();
    expect(transformFormDataToTestApiFormat).toHaveBeenCalledWith(mockFormData);
    expect(mockMutation.mutateAsync).toHaveBeenCalledWith({
      formData: mockFormData,
      ctaId: undefined,
    });
    expect(mockSetValue).toHaveBeenCalledWith("testFeature.prevCtaId", "999", {
      shouldValidate: false,
    });
    expect(toast.success).toHaveBeenCalledWith("Test journey created successfully");
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("should handle update scenario with previousCtaId", async () => {
    const formDataWithPrevId = {
      ...mockFormData,
      testFeature: {
        ...mockFormData.testFeature,
        prevCtaId: "888",
      },
    };

    (transformFormDataToTestApiFormat as jest.Mock).mockReturnValue({
      userIds: [123, 456],
      expiresInMinutes: 30,
      rule: {},
    });
    mockMutation.mutateAsync.mockResolvedValue({ data: 999 });

    await submitTestJourney({
      ...mockParams,
      formData: formDataWithPrevId,
    });

    expect(mockMutation.mutateAsync).toHaveBeenCalledWith({
      formData: formDataWithPrevId,
      ctaId: 888,
    });
    expect(toast.success).toHaveBeenCalledWith("Test journey updated successfully");
  });

  it("should handle validation error for empty user IDs", async () => {
    const error = new Error("User IDs are required");
    (transformFormDataToTestApiFormat as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await submitTestJourney(mockParams);

    expect(mockSetError).toHaveBeenCalledWith(
      "testFeature.userIds",
      expect.objectContaining({
        type: "validation",
        message: "User IDs are required",
      })
    );
    expect(toast.error).toHaveBeenCalledWith("User IDs are required");
    expect(mockMutation.mutateAsync).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("should handle validation error for invalid user ID", async () => {
    const error = new Error("Invalid user ID: abc");
    (transformFormDataToTestApiFormat as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await submitTestJourney(mockParams);

    expect(mockSetError).toHaveBeenCalledWith(
      "testFeature.userIds",
      expect.objectContaining({
        type: "validation",
        message: "Invalid user ID: abc",
      })
    );
    expect(toast.error).toHaveBeenCalledWith("Invalid user ID: abc");
  });

  it("should handle general validation error", async () => {
    const error = new Error("Some other validation error occurred");
    (transformFormDataToTestApiFormat as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await submitTestJourney(mockParams);

    expect(toast.error).toHaveBeenCalledWith("Some other validation error occurred");
    expect(mockSetError).not.toHaveBeenCalledWith(
      "testFeature.userIds",
      expect.anything()
    );
  });

  it("should handle API error with response data", async () => {
    (transformFormDataToTestApiFormat as jest.Mock).mockReturnValue({
      userIds: [123, 456],
      expiresInMinutes: 30,
      rule: {},
    });

    const axiosError = new AxiosError("API Error");
    axiosError.response = {
      data: {
        error: {
          message: "Server error occurred",
        },
      },
    } as any;
    mockMutation.mutateAsync.mockRejectedValue(axiosError);

    await submitTestJourney(mockParams);

    expect(toast.error).toHaveBeenCalledWith("Server error occurred");
    expect(mockSetError).toHaveBeenCalledWith(
      "testFeature",
      expect.objectContaining({
        type: "server",
        message: "Server error occurred",
      })
    );
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("should handle API error without response data", async () => {
    (transformFormDataToTestApiFormat as jest.Mock).mockReturnValue({
      userIds: [123, 456],
      expiresInMinutes: 30,
      rule: {},
    });

    const axiosError = new AxiosError("Network error");
    mockMutation.mutateAsync.mockRejectedValue(axiosError);

    await submitTestJourney(mockParams);

    expect(toast.error).toHaveBeenCalledWith("Network error");
    expect(mockSetError).toHaveBeenCalledWith(
      "testFeature",
      expect.objectContaining({
        type: "server",
        message: "Network error",
      })
    );
  });

  it("should handle API error with fallback message", async () => {
    (transformFormDataToTestApiFormat as jest.Mock).mockReturnValue({
      userIds: [123, 456],
      expiresInMinutes: 30,
      rule: {},
    });

    const error = {} as AxiosError;
    mockMutation.mutateAsync.mockRejectedValue(error);

    await submitTestJourney(mockParams);

    expect(toast.error).toHaveBeenCalledWith(
      "Failed to create test journey. Please try again."
    );
  });

  it("should not set prevCtaId when response has no data", async () => {
    (transformFormDataToTestApiFormat as jest.Mock).mockReturnValue({
      userIds: [123, 456],
      expiresInMinutes: 30,
      rule: {},
    });
    mockMutation.mutateAsync.mockResolvedValue({});

    await submitTestJourney(mockParams);

    expect(mockSetValue).not.toHaveBeenCalledWith(
      "testFeature.prevCtaId",
      expect.anything(),
      expect.anything()
    );
  });

  it("should not call onSuccess when not provided", async () => {
    (transformFormDataToTestApiFormat as jest.Mock).mockReturnValue({
      userIds: [123, 456],
      expiresInMinutes: 30,
      rule: {},
    });
    mockMutation.mutateAsync.mockResolvedValue({ data: 999 });

    await submitTestJourney({
      ...mockParams,
      onSuccess: undefined,
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});

