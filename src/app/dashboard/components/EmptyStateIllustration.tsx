"use client";

import { useTheme } from "@mui/material/styles";
import { THEME_COLORS } from "@/config/colors";
import { EMPTY_STATE_ILLUSTRATION } from "./DashboardConstants";

export default function EmptyStateIllustration() {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const strokeColor =
    theme.palette.mode === "light"
      ? THEME_COLORS.TEXT.light.primary
      : THEME_COLORS.TEXT.dark.primary;

  return (
    <svg
      width={EMPTY_STATE_ILLUSTRATION.width}
      height={EMPTY_STATE_ILLUSTRATION.height}
      viewBox={EMPTY_STATE_ILLUSTRATION.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background blobs */}
      <ellipse
        cx="50"
        cy="80"
        rx="40"
        ry="30"
        fill={primaryColor}
        opacity="0.1"
      />
      <ellipse
        cx="230"
        cy="120"
        rx="35"
        ry="25"
        fill={primaryColor}
        opacity="0.08"
      />
      <ellipse
        cx="140"
        cy="180"
        rx="45"
        ry="35"
        fill={primaryColor}
        opacity="0.06"
      />

      {/* Paper airplane template - unfolded */}
      <g>
        {/* Main body */}
        <path
          d="M140 100 L140 140 L160 160 L140 180 L120 160 Z"
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
        />
        {/* Left wing */}
        <path
          d="M140 100 L80 120 L100 140 L140 120 Z"
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
        />
        {/* Right wing */}
        <path
          d="M140 100 L200 120 L180 140 L140 120 Z"
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
        />
        {/* Crease lines */}
        <line
          x1="140"
          y1="100"
          x2="140"
          y2="180"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <line
          x1="100"
          y1="140"
          x2="180"
          y2="140"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <line
          x1="120"
          y1="160"
          x2="160"
          y2="160"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
      </g>

      {/* Fountain pen */}
      <g>
        {/* Pen body */}
        <path
          d="M70 60 L90 50 L92 65 L90 80 L70 75 Z"
          fill={primaryColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Pen nib */}
        <path
          d="M70 75 L70 80 L75 78 L70 75 Z"
          fill={THEME_COLORS.GRAY["400"]}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        {/* Pen tip touching paper */}
        <circle cx="75" cy="78" r="2" fill={primaryColor} />
      </g>

      {/* Mouse cursor */}
      <g transform="translate(200, 150)">
        <path
          d="M0 0 L12 0 L8 12 L6 10 L0 0 Z"
          fill={primaryColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
      </g>

      {/* Plus icon in circle */}
      <g transform="translate(230, 160)">
        <circle
          cx="0"
          cy="0"
          r="18"
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="-8"
          y1="0"
          x2="8"
          y2="0"
          stroke={primaryColor}
          strokeWidth="2.5"
        />
        <line
          x1="0"
          y1="-8"
          x2="0"
          y2="8"
          stroke={primaryColor}
          strokeWidth="2.5"
        />
      </g>
    </svg>
  );
}
