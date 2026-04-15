import React from "react";
import "./globals.css";
import ClientLayout from "../components/layout/ClientLayout";

export const metadata = {
  title: "Checkout Terminal | v.1 Production Build",
  description: "The premium Business OS for local commerce, trade networking, and commercial growth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
