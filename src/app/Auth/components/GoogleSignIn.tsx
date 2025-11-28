"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { styles } from "./styles/Auth.style";
import { handleGoogleSignInSuccess } from "../Auth.utils";
import { usePermissions } from "@/app/providers/PermissionProvider";

export const GoogleSignIn = () => {
  const router = useRouter();
  const { setUserEmailFromOutside } = usePermissions();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      if (!credentialResponse.credential) {
        console.error("No credential received from Google");
        router.push("/login");
        return;
      }
      const [, payloadBase64] = credentialResponse.credential.split(".");
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson) as { email?: string };

      if (!payload.email) {
        console.error("No email found in Google token payload");
        router.push("/login");
        return;
      }
      setUserEmailFromOutside(payload.email);
      handleGoogleSignInSuccess(
        credentialResponse.credential,
        async () => {
          router.push("/dashboard");
        },
        () => {
          // On error, redirect to login
          console.error("Google sign-in failed!");
          router.push("/login");
        }
      );
    } catch (error) {
      console.error("Error during sign-in process:", error);
      router.push("/login");
    }
  };

  return (
    <div className={styles.signInContainer}>
      <div className={styles.signInContent}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.error("Google sign-in error occurred");
            router.push("/login");
          }}
          width="260"
        />
      </div>
    </div>
  );
};
