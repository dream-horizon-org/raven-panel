"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { styles } from "./components/styles/Auth.style";
import { GoogleSignIn } from "./components/GoogleSignIn";
import { HomePageBackground } from "./components/HomePageBackground";
import { useAuth } from "./hooks/useAuth";

export const Login = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  React.useEffect(() => {
    // Set body background for login page with primary color
    const originalBackground = document.body.style.background;
    const originalBackgroundImage = document.body.style.backgroundImage;

    document.body.style.background =
      "linear-gradient(135deg, #1E293B 0%, #334155 100%)";
    document.body.style.backgroundImage = `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.1) 10px,
      rgba(255, 255, 255, 0.1) 20px
    )`;
    document.body.style.backgroundAttachment = "fixed";

    return () => {
      // Restore original background on unmount
      document.body.style.background = originalBackground;
      document.body.style.backgroundImage = originalBackgroundImage;
    };
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.loginBackground}>
      <HomePageBackground />
      <div className={styles.loginContainer}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <GoogleSignIn />
          </div>
        </div>
      </div>
    </div>
  );
};
