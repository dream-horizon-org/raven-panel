import { Theme, keyframes } from "@mui/material/styles";
import { SxProps } from "@mui/material";

// Define floating animation keyframes
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const landingPageStyles = {
  container: (theme: Theme): SxProps => ({
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    background: "linear-gradient(to right, #ffffff 0%, #f8f9ff 100%)",
  }),

  mainContent: {
    display: "flex",
    flex: 1,
    minHeight: "calc(100vh - 80px)",
    "@media (max-width: 960px)": {
      flexDirection: "column",
    },
  },

  // Left Section - Login Form
  leftSection: (theme: Theme): SxProps => ({
    flex: "0 0 40%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: { xs: 3, md: 6 },
    backgroundColor: "#ffffff",
    "@media (max-width: 960px)": {
      flex: "1 1 auto",
      minHeight: "auto",
    },
  }),

  loginFormContainer: (theme: Theme): SxProps => ({
    width: "100%",
    maxWidth: "448px",
    display: "flex",
    flexDirection: "column",
    gap: 2.5,
  }),

  logoContainer: (theme: Theme): SxProps => ({
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    mb: 1,
  }),

  logoIcon: (theme: Theme): SxProps => ({
    width: 40,
    height: 40,
    borderRadius: "8px",
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: 700,
    fontFamily: "system-ui, -apple-system, sans-serif",
  }),

  logoText: (theme: Theme): SxProps => ({
    fontWeight: 700,
    fontSize: "1.5rem",
    color: "#111827",
    fontFamily: "system-ui, -apple-system, sans-serif",
  }),

  greeting: (theme: Theme): SxProps => ({
    fontWeight: 700,
    fontSize: { xs: "1.75rem", md: "2rem" },
    color: "#111827",
    mb: 0.5,
    fontFamily: "system-ui, -apple-system, sans-serif",
  }),

  subtitle: (theme: Theme): SxProps => ({
    color: "#6b7280",
    fontSize: "0.9375rem",
    mb: 3,
    fontWeight: 400,
  }),

  organizationField: (theme: Theme): SxProps => ({
    mb: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#ffffff",
      fontSize: "1rem",
      paddingLeft: "4px",
      "& fieldset": {
        borderColor: "#e5e7eb",
        borderWidth: "1.5px",
      },
      "&:hover fieldset": {
        borderColor: "#6366f1",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6366f1",
        borderWidth: "2px",
      },
      "&.Mui-error fieldset": {
        borderColor: "#ef4444",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#6b7280",
      fontSize: "0.9375rem",
      fontWeight: 500,
      "&.Mui-focused": {
        color: "#6366f1",
      },
      "&.Mui-error": {
        color: "#ef4444",
      },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: "4px",
      fontSize: "0.8125rem",
      marginTop: "6px",
    },
  }),

  inputIcon: (theme: Theme): SxProps => ({
    color: "#9ca3af",
    fontSize: "1.25rem",
  }),

  signInButton: (theme: Theme): SxProps => ({
    textTransform: "none",
    fontSize: "1.0625rem",
    fontWeight: 600,
    py: 1.75,
    borderRadius: "10px",
    backgroundColor: "#6366f1",
    color: "#ffffff",
    boxShadow: "0 2px 4px 0 rgba(99, 102, 241, 0.2)",
    mt: 2,
    "&:hover": {
      backgroundColor: "#4f46e5",
      boxShadow: "0 4px 12px 0 rgba(99, 102, 241, 0.3)",
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
    "&:disabled": {
      backgroundColor: "#e5e7eb",
      color: "#9ca3af",
      boxShadow: "none",
      cursor: "not-allowed",
    },
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  }),

  // Right Section - Features
  rightSection: (theme: Theme): SxProps => ({
    flex: "0 0 60%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: { xs: 4, md: 6 },
    backgroundColor: "#f8f9ff",
    background: "linear-gradient(to bottom, #f8f9ff 0%, #f0f4ff 100%)",
    "@media (max-width: 960px)": {
      flex: "1 1 auto",
    },
  }),

  featuresContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  featuresTitle: (theme: Theme): SxProps => ({
    fontWeight: 700,
    fontSize: { xs: "1.5rem", md: "1.75rem" },
    color: "#111827",
    lineHeight: 1.3,
    fontFamily: "system-ui, -apple-system, sans-serif",
    textAlign: "center",
    mb: 5,
  }),

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr 1fr 1fr",
    },
    gridTemplateRows: {
      xs: "auto auto auto auto",
      sm: "auto auto",
    },
    gridTemplateAreas: {
      xs: '"left" "center-top" "center-bottom" "right"',
      sm: '"left center-top right" "left center-bottom right"',
    },
    gap: 4,
    width: "100%",
    alignItems: "center",
    "@media (max-width: 960px)": {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto",
      gridTemplateAreas: '"left" "center-top" "center-bottom" "right"',
      alignItems: "start",
    },
  },

  featureCard: (theme: Theme, gridArea?: string, color?: string, animationDelay?: string): SxProps => ({
    height: "auto",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    position: "relative",
    overflow: "hidden",
    gridArea: gridArea || "auto",
    animation: `${float} 6s ease-in-out infinite`,
    animationDelay: animationDelay || "0s",
    "@media (min-width: 960px)": {
      minHeight: gridArea === "left" || gridArea === "right" ? "auto" : "160px",
      maxHeight: gridArea === "left" || gridArea === "right" ? "fit-content" : "none",
      alignSelf: gridArea === "left" || gridArea === "right" ? "center" : "start",
    },
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
      animation: "none",
    },
  }),

  featureColorBar: (color: string): SxProps => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    backgroundColor: color,
    zIndex: 1,
  }),

  featureCardContent: {
    padding: "24px !important",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    gap: 1.5,
  },

  featureHeader: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    marginBottom: "4px",
  },

  featureIconWrapper: (theme: Theme, index: number, color?: string): SxProps => {
    const iconBgColors = [
      "rgba(99, 102, 241, 0.1)", // Light indigo
      "rgba(239, 68, 68, 0.1)", // Light red
      "rgba(234, 179, 8, 0.1)", // Light yellow
      "rgba(59, 130, 246, 0.1)", // Light blue
    ];
    
    return {
      width: 40,
      height: 40,
      borderRadius: "8px",
      backgroundColor: color ? `${color}1A` : iconBgColors[index % iconBgColors.length],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    };
  },

  featureIcon: (theme: Theme, index?: number, color?: string): SxProps => {
    const iconColors = [
      "#6366f1", // Indigo
      "#ef4444", // Red
      "#eab308", // Yellow
      "#3b82f6", // Blue
    ];
    
    return {
      fontSize: "1.25rem",
      color: color || (index !== undefined ? iconColors[index % iconColors.length] : theme.palette.primary.main),
    };
  },

  featureTitle: (theme: Theme): SxProps => ({
    fontWeight: 600,
    fontSize: "1.25rem",
    color: "#1f2937",
    marginBottom: 0,
    fontFamily: "system-ui, -apple-system, sans-serif",
    lineHeight: 1.3,
  }),

  featureDescription: (theme: Theme): SxProps => ({
    color: "#6b7280",
    fontSize: "0.9375rem",
    lineHeight: 1.6,
    fontWeight: 400,
  }),

  // Footer
  footer: (theme: Theme): SxProps => ({
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    mt: "auto",
  }),

  footerContent: {
    py: 3,
    textAlign: "center",
  },

  footerText: (theme: Theme): SxProps => ({
    color: "#6b7280",
    fontSize: "0.875rem",
  }),
};
