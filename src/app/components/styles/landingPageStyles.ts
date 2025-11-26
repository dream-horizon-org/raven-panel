import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/material";

export const landingPageStyles = {
  container: (theme: Theme): SxProps => ({
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.mode === "dark" ? "#0a0a0a" : "#1a1a2e",
  }),

  header: (theme: Theme): SxProps => ({
    borderBottom: `1px solid ${
      theme.palette.mode === "dark" ? "#374151" : "#2a2a3e"
    }`,
    backgroundColor: theme.palette.mode === "dark" ? "#0a0a0a" : "#1a1a2e",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
  }),

  headerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    py: 2,
  },

  logo: (theme: Theme): SxProps => ({
    fontWeight: 700,
    color: "#ffffff",
  }),

  signInButton: (theme: Theme): SxProps => ({
    textTransform: "none",
    fontWeight: 600,
    px: 3,
    borderColor: theme.palette.mode === "dark" ? "#64748B" : "#1E293B",
    color: theme.palette.mode === "dark" ? "#cbd5e1" : "#ffffff",
    "&:hover": {
      borderColor: theme.palette.mode === "dark" ? "#94a3b8" : "#475569",
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(100, 116, 139, 0.1)"
          : "rgba(30, 41, 59, 0.1)",
    },
  }),

  headerButton: (theme: Theme): SxProps => ({
    textTransform: "none",
    fontWeight: 600,
    px: 3,
    backgroundColor: theme.palette.mode === "dark" ? "#64748B" : "#1E293B",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "#475569" : "#334155",
    },
  }),

  heroSection: (theme: Theme): SxProps => ({
    py: { xs: 8, md: 12 },
    textAlign: "center",
    backgroundColor: theme.palette.mode === "dark" ? "#0a0a0a" : "#1a1a2e",
  }),

  heroTitle: (theme: Theme): SxProps => ({
    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
    fontWeight: 800,
    mb: 3,
    color: "#ffffff",
    lineHeight: 1.2,
  }),

  heroTitleHighlight: (theme: Theme): SxProps => ({
    color: theme.palette.mode === "dark" ? "#cbd5e1" : "#94a3b8",
  }),

  heroDescription: (theme: Theme): SxProps => ({
    fontSize: { xs: "1.1rem", md: "1.25rem" },
    color: "#ffffff",
    maxWidth: "700px",
    mx: "auto",
    mb: 4,
    lineHeight: 1.6,
  }),

  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 2,
    mt: 1,
  },

  ctaButton: (theme: Theme): SxProps => ({
    textTransform: "none",
    fontSize: "1.1rem",
    fontWeight: 600,
    px: 4,
    py: 1.5,
    borderRadius: 2,
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #64748B 0%, #475569 100%)"
        : "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
    "&:hover": {
      background:
        theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #475569 0%, #334155 100%)"
          : "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
      transform: "translateY(-2px)",
      boxShadow:
        theme.palette.mode === "dark"
          ? "0px 8px 16px rgba(100, 116, 139, 0.3)"
          : "0px 8px 16px rgba(30, 41, 59, 0.3)",
    },
    transition: "all 0.3s ease",
  }),

  featuresSection: (theme: Theme): SxProps => ({
    py: { xs: 6, md: 8 },
    backgroundColor: theme.palette.mode === "dark" ? "#0a0a0a" : "#1a1a2e",
  }),

  sectionTitle: (theme: Theme): SxProps => ({
    textAlign: "center",
    mb: 3,
    fontWeight: 700,
    color: "#ffffff",
  }),

  featureCard: (theme: Theme): SxProps => ({
    height: "100%",
    transition: "all 0.3s ease",
    backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#2a2a3e",
    border: `1px solid ${
      theme.palette.mode === "dark" ? "#374151" : "#3a3a4e"
    }`,
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.5)",
      borderColor: theme.palette.mode === "dark" ? "#64748B" : "#1E293B",
    },
  }),

  featureTitle: (theme: Theme): SxProps => ({
    fontWeight: 600,
    mb: 2,
    color: "#ffffff",
  }),

  featureDescription: (theme: Theme): SxProps => ({
    color: "#ffffff",
    lineHeight: 1.7,
  }),

  ctaSection: (theme: Theme): SxProps => ({
    py: { xs: 8, md: 12 },
    textAlign: "center",
    backgroundColor: theme.palette.mode === "dark" ? "#64748B" : "#1E293B",
    color: "#ffffff",
  }),

  ctaTitle: {
    mb: 3,
    fontWeight: 700,
    color: "#ffffff",
  },

  ctaDescription: {
    mb: 4,
    color: "rgba(255, 255, 255, 0.9)",
    maxWidth: "600px",
    mx: "auto",
  },

  ctaButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 2,
  },

  ctaButtonPrimary: (theme: Theme): SxProps => ({
    textTransform: "none",
    fontSize: "1.1rem",
    fontWeight: 600,
    px: 4,
    py: 1.5,
    borderRadius: 2,
    backgroundColor: "#ffffff",
    color: theme.palette.mode === "dark" ? "#64748B" : "#1E293B",
    border: "2px solid #ffffff",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#ffffff",
      transform: "translateY(-2px)",
      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    },
    transition: "all 0.3s ease",
  }),

  footer: (theme: Theme): SxProps => ({
    borderTop: "none",
    backgroundColor: theme.palette.mode === "dark" ? "#64748B" : "#1E293B",
    mt: "auto",
  }),

  footerContent: {
    py: 3,
    textAlign: "center",
  },

  footerText: (theme: Theme): SxProps => ({
    color: "#ffffff",
  }),
};
