import GridViewIcon from "@mui/icons-material/GridView";
import SettingsIcon from "@mui/icons-material/Settings";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RouteIcon from "@mui/icons-material/Route";

export const FEATURES = [
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

// Organization options
export const ORGANIZATIONS = ["dream11"] as const;
// Uncomment when needed: export const ORGANIZATIONS = ["dream11", "criq"] as const;

// Landing page text constants
export const LANDING_PAGE_TEXT = {
  greeting: "Hi, Welcome Back!",
  subtitle: "Enter your organization to continue",
  signInButton: "Sign In",
  organizationRequired: "Organization name is required",
  featuresTitle: "Build better products with our best-in-class tool",
} as const;

// Feature card grid area mappings
export const GRID_AREAS = [
  "left",
  "center-top",
  "center-bottom",
  "right",
] as const;

// Animation delay multiplier for staggered animations
export const ANIMATION_DELAY_MULTIPLIER = 0.5;
