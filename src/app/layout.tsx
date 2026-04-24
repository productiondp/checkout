import React from "react";
import "./globals.css";
import ClientLayout from "../components/layout/ClientLayout";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider, AuthGate } from "@/hooks/useAuth";

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
  title: "Checkout",
  description: "The premium Business OS for local commerce.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Checkout",
  },
  formatDetection: {
     telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full overflow-hidden`}>
      <body className="font-sans bg-white h-full overscroll-none">
        <AuthProvider>
          <AuthGate>
            <ClientLayout>
              {children}
            </ClientLayout>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
