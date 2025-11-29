"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import GridViewIcon from "@mui/icons-material/GridView";
import SettingsIcon from "@mui/icons-material/Settings";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RouteIcon from "@mui/icons-material/Route";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_NAME, FOOTER_TEXT } from "@/config/constants";
import { landingPageStyles } from "./styles/landingPageStyles";

export default function LandingPage() {
  const theme = useTheme();
  const router = useRouter();
  const [organization, setOrganization] = useState("");
  const [touched, setTouched] = useState(false);

  const features = [
    {
      title: "Rich Component Library",
      description:
        "Explore UI components like bottomsheets, popups, tooltips, and more.",
      icon: GridViewIcon,
      color: "#6366f1", // Indigo
    },
    {
      title: "Customizable Design System",
      description:
        "Easily adapt interface elements to match your brand guidelines.",
      icon: SettingsIcon,
      color: "#ef4444", // Red
    },
    {
      title: "Dynamic User Targeting",
      description:
        "Leverage behavioral insights to deliver personalized experiences.",
      icon: TrendingDownIcon,
      color: "#eab308", // Yellow
    },
    {
      title: "Journey-Based Engagement",
      description:
        "Present contextual experiences tailored to specific user journeys.",
      icon: RouteIcon,
      color: "#3b82f6", // Blue
    },
  ];

  const handleOrganizationChange = (value: string) => {
    setOrganization(value);
    // Store organization in localStorage as user types
    if (value.trim()) {
      localStorage.setItem("organization", value.trim());
    } else {
      localStorage.removeItem("organization");
    }
  };

  const handleSignIn = () => {
    if (!organization.trim()) {
      setTouched(true);
      return;
    }
    router.push("/login");
  };


  return (
    <Box sx={landingPageStyles.container(theme)}>
      <Box sx={landingPageStyles.mainContent}>
        {/* Left Side - Login Form */}
        <Box sx={landingPageStyles.leftSection(theme)}>
          <Box sx={landingPageStyles.loginFormContainer(theme)}>
            {/* Logo */}
            <Box sx={landingPageStyles.logoContainer(theme)}>
              <Box
                component="span"
                sx={landingPageStyles.logoIcon(theme)}
              >
                {APP_NAME.charAt(0)}
              </Box>
              <Typography variant="h5" sx={landingPageStyles.logoText(theme)}>
                {APP_NAME}
              </Typography>
            </Box>

            {/* Greeting */}
            <Typography variant="h4" sx={landingPageStyles.greeting(theme)}>
              Hi, Welcome Back!
            </Typography>

            {/* Subtitle */}
            <Typography variant="body1" sx={landingPageStyles.subtitle(theme)}>
              Enter your organization to continue
            </Typography>

            {/* Organization Field */}
            <TextField
              fullWidth
              required
              label="Organization"
              placeholder="Enter your organization name"
              value={organization}
              onChange={(e) => handleOrganizationChange(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && organization.trim()) {
                  handleSignIn();
                }
              }}
              sx={landingPageStyles.organizationField(theme)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon sx={landingPageStyles.inputIcon(theme)} />
                  </InputAdornment>
                ),
              }}
              helperText={
                touched && !organization.trim()
                  ? "Organization name is required"
                  : ""
              }
              error={touched && !organization.trim()}
            />

            {/* Sign In Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSignIn}
              disabled={!organization.trim()}
              sx={landingPageStyles.signInButton(theme)}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        {/* Right Side - Features */}
        <Box sx={landingPageStyles.rightSection(theme)}>
          <Box sx={landingPageStyles.featuresContainer}>
            <Typography
              variant="h3"
              component="h2"
              sx={landingPageStyles.featuresTitle(theme)}
            >
              Build better products with our best-in-class tool
            </Typography>
            <Box sx={landingPageStyles.featuresGrid}>
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                // Custom placement: 0=left, 1=center-top, 2=center-bottom, 3=right
                const gridArea = 
                  index === 0 ? "left" :
                  index === 1 ? "center-top" :
                  index === 2 ? "center-bottom" :
                  "right";
                // Staggered animation delay for floating effect
                const animationDelay = `${index * 0.5}s`;
                return (
                  <Card 
                    key={index} 
                    sx={landingPageStyles.featureCard(theme, gridArea, feature.color, animationDelay)}
                  >
                    <Box sx={landingPageStyles.featureColorBar(feature.color)} />
                    <CardContent sx={landingPageStyles.featureCardContent}>
                      <Box sx={landingPageStyles.featureHeader}>
                        <Box
                          sx={landingPageStyles.featureIconWrapper(theme, index, feature.color)}
                        >
                          <IconComponent sx={landingPageStyles.featureIcon(theme, index, feature.color)} />
                        </Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={landingPageStyles.featureTitle(theme)}
                        >
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={landingPageStyles.featureDescription(theme)}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        </Box>
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
