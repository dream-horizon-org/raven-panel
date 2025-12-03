"use client";

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/app/Auth/components/ProtectedRoute";
import { AppTenantSync } from "@/app/components/TenantSync";
import { AppTenantPersist } from "@/app/components/TenantPersist";

export default function DashboardRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AppTenantSync />
      <AppTenantPersist />
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
