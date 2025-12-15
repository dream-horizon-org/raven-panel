"use client";

import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { landingPageStyles } from "../styles/landingPageStyles";
import { handleGoogleSuccess } from "@/app/Auth/components/GoogleSignIn";
import { usePermissions } from "@/app/providers/PermissionProvider";
import { LANDING_PAGE_TEXT } from "../constants";
import Logo from "./Logo";
import OrganizationField from "./OrganizationField";

interface LoginFormProps {
  organization: string;
  touched: boolean;
  onOrganizationChange: (value: string) => void;
  onTouchedChange: (touched: boolean) => void;
}

export default function LoginForm({
  organization,
  touched,
  onOrganizationChange,
  onTouchedChange,
}: LoginFormProps) {
  const theme = useTheme();
  const router = useRouter();
  const { setUserEmailFromOutside } = usePermissions();
  const googleLoginRef = useRef<HTMLDivElement>(null);

  const handleSignIn = () => {
    if (!organization.trim()) {
      onTouchedChange(true);
      return;
    }

    const googleButton = googleLoginRef.current?.querySelector(
      'div[role="button"]'
    ) as HTMLElement;
    if (googleButton) {
      googleButton.click();
    }
  };

  return (
    <Box sx={landingPageStyles.leftSection(theme)}>
      <Box sx={landingPageStyles.loginFormContainer(theme)}>
        <Logo />

        <Typography variant="h4" sx={landingPageStyles.greeting(theme)}>
          {LANDING_PAGE_TEXT.greeting}
        </Typography>

        <Typography variant="body1" sx={landingPageStyles.subtitle(theme)}>
          {LANDING_PAGE_TEXT.subtitle}
        </Typography>

        <OrganizationField
          organization={organization}
          touched={touched}
          onOrganizationChange={onOrganizationChange}
          onBlur={() => onTouchedChange(true)}
        />

        <Box ref={googleLoginRef} sx={{ display: "none" }}>
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
            }}
            width="0"
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSignIn}
          disabled={!organization.trim()}
          sx={landingPageStyles.signInButton(theme)}
        >
          {LANDING_PAGE_TEXT.signInButton}
        </Button>
      </Box>
    </Box>
  );
}
