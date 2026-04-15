import React from "react";
import "./globals.css";
import ClientLayout from "../components/layout/ClientLayout";

export const metadata = {
  title: "Checkout Terminal | v.1 Production Build",
  description: "The premium Business OS for local commerce, trade networking, and commercial growth.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Checkout",
  },
  themeColor: "#FFFFFF",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className="bg-white h-full overscroll-none">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
