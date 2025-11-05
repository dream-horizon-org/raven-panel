import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function DashboardRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
