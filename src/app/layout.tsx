import type { Metadata, Viewport } from "next";
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

export async function generateViewport(): Promise<Viewport> {
  const branding = getBranding();
  return {
    themeColor: branding.colors.primary,
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const branding = getBranding();
  const domain = branding.displayDomain;
  const url = `https://${domain}`;

  return {
    title: {
      default: branding.brandName,
      template: `%s | ${branding.brandName}`,
    },
    description: branding.headline,
    metadataBase: new URL(url),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: branding.brandName,
      description: branding.headline,
      url: url,
      siteName: branding.brandName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 600,
          alt: branding.brandName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: branding.brandName,
      description: branding.headline,
      images: ["/logo.png"],
    },
    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
    },
  };
}

import Crosshair from "@/components/ui/Crosshair";
import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";

import MixpanelProvider from "@/components/analytics/MixpanelProvider";
import FirebaseAuthProvider from "@/components/auth/FirebaseAuthProvider";

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
        {branding.crosshairCursor?.enabled && (
          <Crosshair {...branding.crosshairCursor} />
        )}
        <MixpanelProvider>
          <FirebaseAuthProvider>
            <Navbar branding={branding} />
            <Footer branding={branding} />
            <GooeyGradientBackground branding={branding}>
              {children}
            </GooeyGradientBackground>
          </FirebaseAuthProvider>
        </MixpanelProvider>
      </body>
    </html>
  );
}
