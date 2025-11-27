"use client";

import React from "react";

import { useHomePageDots } from "./useDots";
import { styles } from "./styles/Auth.style";

export const HomePageBackground = () => {
  const { dots } = useHomePageDots({ rows: 20, cols: 30 });

  return (
    <div className={styles.loginDots}>
      {dots.map((dot) => (
        <div
          key={dot.id}
          style={{
            position: "absolute",
            top: `${dot.y}px`,
            left: `${dot.x}px`,
            transform: `rotate(${dot.angle}deg)`,
            width: `${dot.dotWidth}px`,
            height: "2px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: "9999px",
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
};
