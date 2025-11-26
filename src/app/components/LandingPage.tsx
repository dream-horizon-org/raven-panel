"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  APP_NAME,
  BUTTON_TEXT,
  FOOTER_TEXT,
  PAGE_TITLES,
} from "@/config/constants";
import { landingPageStyles } from "./styles/landingPageStyles";
import { useAuth } from "@/app/Auth/hooks/useAuth";

interface UserInfo {
  name?: string;
  email?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

const getUserInfo = (): UserInfo | null => {
  try {
    const userData = localStorage.getItem("google_user");
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  return null;
};

export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setUserInfo(getUserInfo());
    } else {
      setUserInfo(null);
    }
  }, [isAuthenticated]);

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  const features = [
    {
      title: "Journey Management",
      description:
        "Create and manage customer engagement journeys with powerful triggers, filters, and scheduling",
    },
    {
      title: "Real-time Engagement",
      description:
        "Deliver personalized in-app experiences that engage users at the right moment",
    },
    {
      title: "Advanced Targeting",
      description: "Target users with precision using cohorts",
    },
  ];

  return (
    <Box sx={landingPageStyles.container(theme)}>
      {/* Header */}
      <Box component="header" sx={landingPageStyles.header(theme)}>
        <Container maxWidth="xl" sx={landingPageStyles.headerContainer}>
          <Typography variant="h5" sx={landingPageStyles.logo(theme)}>
            {APP_NAME}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {isAuthenticated && userInfo ? (
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  cursor: "pointer",
                }}
                src={userInfo.picture}
                onClick={handleGoToDashboard}
              />
            ) : (
              <Button
                variant="outlined"
                onClick={handleSignIn}
                sx={landingPageStyles.signInButton(theme)}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box component="section" sx={landingPageStyles.heroSection(theme)}>
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            sx={landingPageStyles.heroTitle(theme)}
          >
            Build Powerful In-App{" "}
            <Box
              component="span"
              sx={landingPageStyles.heroTitleHighlight(theme)}
            >
              Engagement Journeys
            </Box>
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={landingPageStyles.heroDescription(theme)}
          >
            {APP_NAME} is an in-app engagement platform that helps you create,
            manage, and optimize customer journeys. Deliver personalized
            experiences, trigger engagement based on user behavior, and drive
            meaningful interactions.
          </Typography>
          <Box sx={landingPageStyles.heroButtons}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGoToDashboard}
              sx={landingPageStyles.ctaButton(theme)}
            >
              {BUTTON_TEXT.GO_TO_DASHBOARD}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box component="section" sx={landingPageStyles.featuresSection(theme)}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={landingPageStyles.sectionTitle(theme)}
          >
            Why Choose {APP_NAME}?
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 4,
              mt: 4,
            }}
          >
            {features.map((feature, index) => (
              <Card key={index} sx={landingPageStyles.featureCard(theme)}>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={landingPageStyles.featureTitle(theme)}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={landingPageStyles.featureDescription(theme)}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box component="section" sx={landingPageStyles.ctaSection(theme)}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            sx={landingPageStyles.ctaTitle}
          >
            Ready to Elevate Your User Engagement?
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={landingPageStyles.ctaDescription}
          >
            Start building powerful in-app engagement journeys today. Join teams
            using {APP_NAME} to create meaningful customer experiences and drive
            better outcomes.
          </Typography>
          <Box sx={landingPageStyles.ctaButtons}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => window.open("https://docs.dream11.com", "_blank")}
              sx={landingPageStyles.ctaButtonPrimary(theme)}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={landingPageStyles.footer(theme)}>
        <Container maxWidth="xl">
          <Box sx={landingPageStyles.footerContent}>
            <Typography
              variant="body2"
              sx={landingPageStyles.footerText(theme)}
            >
              {FOOTER_TEXT}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
