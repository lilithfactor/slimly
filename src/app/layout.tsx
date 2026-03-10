import type { Metadata } from "next";
import localFont from "next/font/local";
import { GooeyGradientBackground } from "@/components/ui/GooeyGradientBackground";
import "./globals.css";

const manrope = localFont({
  src: [
    {
      path: "./fonts/manrope/Manrope-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/manrope/Manrope-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/manrope/Manrope-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/manrope/Manrope-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
});

import { getBranding } from "@/lib/branding";

export async function generateMetadata(): Promise<Metadata> {
  const branding = getBranding();
  return {
    title: branding.brandName,
    description: branding.headline,
  };
}

import Crosshair from "@/components/ui/Crosshair";
import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";

import MixpanelProvider from "@/components/analytics/MixpanelProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = getBranding();
  return (
    <html lang="en" className={manrope.variable}>
      <body
        className={`${manrope.className} antialiased ${branding.crosshairCursor?.enabled ? 'hide-cursor' : ''}`}
      >
        <MixpanelProvider>
          {branding.crosshairCursor?.enabled && (
            <Crosshair {...branding.crosshairCursor} />
          )}
          <Navbar branding={branding} />
          <Footer branding={branding} />
          <GooeyGradientBackground branding={branding}>
            {children}
          </GooeyGradientBackground>
        </MixpanelProvider>
      </body>
    </html>
  );
}
