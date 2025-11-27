"use client";

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/app/Auth/components/ProtectedRoute";

export default function DashboardRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
