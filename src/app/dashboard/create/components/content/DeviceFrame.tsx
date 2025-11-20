"use client";

import { Box } from "@mui/material";
import { ReactNode } from "react";

interface DeviceFrameProps {
  children: ReactNode;
  device?: "iphone" | "pixel" | "generic";
  width?: number;
  aspect?: number;
  background?: string;
}

export default function DeviceFrame({
  children,
  device = "iphone",
  width = 360,
  aspect = 19.5 / 9,
}: DeviceFrameProps) {
  const height = width * aspect;

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: "48px",
          backgroundColor: "#000",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          // padding: "10px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "36px",
            overflow: "hidden",
            backgroundColor: "#fff",
            position: "relative",
          }}
        >
          {/* Device notch/camera cutout */}
          {device === "iphone" ? (
            <Box
              sx={{
                position: "absolute",
                top: "8px",
                left: `calc(50% - 72px)`,
                width: "144px",
                height: "24px",
                backgroundColor: "#000",
                borderRadius: "16px",
                zIndex: 2,
              }}
            />
          ) : device === "pixel" ? (
            <Box
              sx={{
                position: "absolute",
                top: "6px",
                left: `calc(50% - 6px)`,
                width: "12px",
                height: "12px",
                backgroundColor: "#000",
                borderRadius: "6px",
                zIndex: 2,
              }}
            />
          ) : null}

          {/* Screen content area */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              padding: 0,
              backgroundColor: "rgb(246,247,249)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
