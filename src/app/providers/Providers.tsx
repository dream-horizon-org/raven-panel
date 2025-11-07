"use client";

import { Toaster } from "sonner";
import { ErrorBoundary } from "@/ui/ErrorBoundary";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeModeProvider } from "./ThemeModeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeModeProvider>
          <ThemeProvider>
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </ThemeModeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
