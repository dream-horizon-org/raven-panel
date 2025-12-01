"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/ui/ErrorBoundary";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeModeProvider } from "./ThemeModeProvider";
import { PermissionProvider } from "./PermissionProvider";
import { MultiTenantProvider } from "./MultiTenantProvider";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <QueryProvider>
          <MultiTenantProvider>
            <PermissionProvider>
              <ThemeModeProvider>
                <ThemeProvider>
                  {children}
                  <Toaster position="top-center" />
                </ThemeProvider>
              </ThemeModeProvider>
            </PermissionProvider>
          </MultiTenantProvider>
        </QueryProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}
