"use client";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { landingPageStyles } from "./styles/landingPageStyles";
import { useAuth } from "@/app/Auth/hooks/useAuth";
import { useMultiTenant } from "@/app/providers/MultiTenantProvider";
import { buildPathWithTenant } from "@/app/utils/tenant.utils";
import LoginForm from "./landing/LoginForm";
import FeaturesSection from "./landing/FeaturesSection";
import Footer from "./landing/Footer";

export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { setTenantData } = useMultiTenant();
  const [organization, setOrganization] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const tenant =
        organization.trim() || localStorage.getItem("organization");
      if (tenant) {
        const { pathname, search } = buildPathWithTenant("/dashboard", tenant);
        router.push(`${pathname}${search}`);
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, router, organization]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  const handleOrganizationChange = (value: string) => {
    setOrganization(value);
    // Store organization in localStorage and set tenant
    if (value.trim()) {
      localStorage.setItem("organization", value.trim());
      setTenantData({ name: value.trim() });

      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        const { pathname, search } = buildPathWithTenant(
          window.location.pathname,
          value.trim(),
          window.location.search
        );
        router.replace(`${pathname}${search}`);
      }
    } else {
      localStorage.removeItem("organization");
      setTenantData({});
    }
  };

  return (
    <Box sx={landingPageStyles.container(theme)}>
      <Box sx={landingPageStyles.mainContent}>
        <LoginForm
          organization={organization}
          touched={touched}
          onOrganizationChange={handleOrganizationChange}
          onTouchedChange={setTouched}
        />
        <FeaturesSection />
      </Box>
      <Footer />
    </Box>
  );
}
