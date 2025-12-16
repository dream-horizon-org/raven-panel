"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import { styles } from "./styles/Auth.style";
import { handleGoogleSignInSuccess } from "../utils/Auth.utils";
import { usePermissions } from "@/app/providers/PermissionProvider";
import { buildPathWithTenant } from "@/app/components/utils/tenanat.utils";

export const handleGoogleSuccess = async (
  credentialResponse: CredentialResponse,
  router: ReturnType<typeof useRouter>,
  setUserEmailFromOutside: (email: string | null) => void
) => {
  try {
    if (!credentialResponse.credential) {
      console.error("No credential received from Google");
      router.push("/");
      return;
    }
    const [, payloadBase64] = credentialResponse.credential.split(".");
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson) as { email?: string };

    if (!payload.email) {
      console.error("No email found in Google token payload");
      router.push("/");
      return;
    }
    setUserEmailFromOutside(payload.email);
    handleGoogleSignInSuccess(
      credentialResponse.credential,
      async () => {
        const tenant =
          typeof window !== "undefined"
            ? localStorage.getItem("organization") ||
              JSON.parse(localStorage.getItem("tenantData") || "{}")?.name
            : null;
        if (tenant) {
          const { pathname, search } = buildPathWithTenant(
            "/dashboard",
            tenant
          );
          router.push(`${pathname}${search}`);
        } else {
          router.push("/dashboard");
        }
      },
      () => {
        // On error, redirect to login
        console.error("Google sign-in failed!");
        router.push("/");
      }
    );
  } catch (error) {
    console.error("Error during sign-in process:", error);
    router.push("/");
  }
};

export const GoogleSignIn = () => {
  const router = useRouter();
  const { setUserEmailFromOutside } = usePermissions();

  return (
    <div className={styles.signInContainer}>
      <div className={styles.signInContent}>
        <GoogleLogin
          onSuccess={(credentialResponse) =>
            handleGoogleSuccess(
              credentialResponse,
              router,
              setUserEmailFromOutside
            )
          }
          onError={() => {
            console.error("Google sign-in error occurred");
            router.push("/");
          }}
          width="260"
        />
      </div>
    </div>
  );
};
