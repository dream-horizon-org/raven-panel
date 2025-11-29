"use client";

import { useState, useEffect } from "react";

const checkAuthStatus = (): boolean => {
  try {
    const token = localStorage.getItem("google_jwt");
    const userData = localStorage.getItem("google_user");
    return !!(token && userData);
  } catch (error) {
    console.error("Error checking auth status:", error);
    return false;
  }
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial check
    const authenticated = checkAuthStatus();
    setIsAuthenticated(authenticated);
    setIsLoading(false);

    // Listen for storage changes (when cookies/localStorage are cleared)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "google_jwt" || e.key === "google_user" || e.key === null) {
        const authenticated = checkAuthStatus();
        setIsAuthenticated(authenticated);
        if (!authenticated) {
          // Redirect to login if auth is lost
          window.location.href = "/";
        }
      }
    };

    // Periodic check for localStorage changes (handles cases where storage events don't fire)
    const intervalId = setInterval(() => {
      const authenticated = checkAuthStatus();
      setIsAuthenticated((prev) => {
        if (prev !== authenticated && !authenticated) {
          // Redirect to login if auth is lost
          window.location.href = "/";
        }
        return authenticated;
      });
    }, 1000); // Check every second

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("google_jwt");
    localStorage.removeItem("google_user");
    localStorage.removeItem("x-permissions");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return {
    isAuthenticated,
    isLoading,
    handleSignOut,
  };
};
