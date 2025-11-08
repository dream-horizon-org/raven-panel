import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/Providers";
import { APP_NAME, PAGE_TITLES } from "@/config/constants";
import { CSSVariables } from "@/components/CSSVariables";

const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: PAGE_TITLES.JOURNEYS_LISTING,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redHatDisplay.variable} antialiased`}
        style={{ fontFamily: "var(--font-red-hat-display)" }}
      >
        <CSSVariables />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
