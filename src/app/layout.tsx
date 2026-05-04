import React from "react";
import "./globals.css";
import { Inter, Outfit } from "next/font/google";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-outfit" });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#292828",
};

export const metadata = {
  title: "Checkout Business OS",
  description: "Initialize your Core Network Mission. The strategic roadmap for professional partnerships and business growth.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Checkout",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  formatDetection: {
     telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans bg-white min-h-screen selection:bg-red-50">
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
