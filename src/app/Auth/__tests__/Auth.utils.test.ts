import { handleGoogleSignInSuccess } from "../utils/Auth.utils";
import { jwtDecode } from "jwt-decode";

// Mock jwtDecode
jest.mock("jwt-decode");

describe("Auth.utils", () => {
  let store: Record<string, string> = {};
  let consoleErrorSpy: jest.SpyInstance;

  const localStorageMock = {
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    store = {};
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    // Spy on the methods to track calls
    jest.spyOn(localStorageMock, "getItem");
    jest.spyOn(localStorageMock, "setItem");
    jest.spyOn(localStorageMock, "removeItem");
    jest.spyOn(localStorageMock, "clear");

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    consoleErrorSpy.mockRestore();
  });

  describe("handleGoogleSignInSuccess", () => {
    const mockUser = {
      email: "test@example.com",
      name: "Test User",
      picture: "https://example.com/picture.jpg",
    };

    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();

    it("should successfully decode JWT and call onSuccess", () => {
      const mockCredential = "valid.jwt.token";
      (jwtDecode as jest.Mock).mockReturnValue(mockUser);

      handleGoogleSignInSuccess(mockCredential, mockOnSuccess);

      expect(jwtDecode).toHaveBeenCalledWith(mockCredential);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "google_jwt",
        mockCredential
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "google_user",
        JSON.stringify(mockUser)
      );
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUser);
    });

    it("should handle empty credential and call onError", () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation();

      handleGoogleSignInSuccess("", mockOnSuccess, mockOnError);

      expect(mockOnError).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(jwtDecode).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });

    it("should handle whitespace-only credential and call onError", () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation();

      handleGoogleSignInSuccess("   ", mockOnSuccess, mockOnError);

      expect(mockOnError).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });

    it("should handle failed JWT decode and call onError", () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation();
      (jwtDecode as jest.Mock).mockReturnValue(null);

      handleGoogleSignInSuccess("invalid.token", mockOnSuccess, mockOnError);

      expect(mockOnError).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });

    it("should handle JWT decode error and call onError", () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation();
      (jwtDecode as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      handleGoogleSignInSuccess("invalid.token", mockOnSuccess, mockOnError);

      expect(mockOnError).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });

    it("should show alert when onError is not provided", () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation();

      handleGoogleSignInSuccess("", mockOnSuccess);

      expect(alertSpy).toHaveBeenCalledWith(
        "Google sign-in failed! Invalid credential."
      );

      alertSpy.mockRestore();
    });

    it("should store user data in localStorage", () => {
      const mockCredential = "valid.jwt.token";
      (jwtDecode as jest.Mock).mockReturnValue(mockUser);

      handleGoogleSignInSuccess(mockCredential, mockOnSuccess);

      expect(localStorage.getItem("google_jwt")).toBe(mockCredential);
      expect(localStorage.getItem("google_user")).toBe(
        JSON.stringify(mockUser)
      );
    });
  });
});
