import { stylesheet } from "typestyle";
import { NestedCSSProperties } from "typestyle/lib/types";

export const styles = stylesheet({
  authContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  authCard: {
    width: "100%",
    maxWidth: "448px",
    padding: "32px",
    borderRadius: "8px",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "& > * + *": {
      marginTop: "32px",
    },
  } as NestedCSSProperties,
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--foreground)",
  },
  input: {
    marginTop: "4px",
    borderColor: "var(--border)",
  },
  // Submit Button
  submitButton: {
    width: "100%",
  },
  // Auth Footer
  authFooter: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14px",
  },
  authFooterText: {
    color: "var(--muted-foreground)",
  },
  authFooterLink: {
    padding: 0,
    color: "var(--primary)",
    "&:hover": {
      textDecoration: "underline",
    },
  } as NestedCSSProperties,
  // GoogleSignIn styles
  signInContainer: {
    textAlign: "center",
    marginBottom: "0",
  } as NestedCSSProperties,

  signInTitle: {
    fontSize: "48px",
    fontWeight: "bold",
    letterSpacing: "-0.025em",
    color: "#ffffff",
    fontFamily: "system-ui",
    margin: 0,
  } as NestedCSSProperties,

  signInSubtitle: {
    marginTop: "8px",
    fontSize: "14px",
    color: "var(--muted-foreground)",
  } as NestedCSSProperties,

  signInContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "center",
    width: "100%",
  } as NestedCSSProperties,

  // Register Header styles
  registerHeader: {
    textAlign: "center",
  } as NestedCSSProperties,

  registerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "-0.025em",
  } as NestedCSSProperties,

  registerSubtitle: {
    marginTop: "8px",
    fontSize: "14px",
    color: "var(--muted-foreground)",
  } as NestedCSSProperties,
  loginBackground: {
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#1a1a2e",
  } as NestedCSSProperties,
  loginContainer: { position: "relative", zIndex: 1 },
  loginDots: { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" },

  homePageDots: {
    position: "absolute",
    height: "2px",
    backgroundColor: "var(--login-dots)",
    borderRadius: "9999px",
  } as NestedCSSProperties,
});

export const homePageDotsDot = (dot: {
  y: number;
  x: number;
  angle: number;
  dotWidth: number;
}): NestedCSSProperties => ({
  top: `${dot.y}px`,
  left: `${dot.x}px`,
  transform: `rotate(${dot.angle}deg)`,
  width: `${dot.dotWidth}px`,
  opacity: 0.15,
  backgroundColor: "var(--background)",
  borderRadius: "50%",
  height: "0.5px",
});
