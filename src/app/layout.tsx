import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Checkout | Hyperlocal Matchmaking",
  description: "The premium network for local commerce.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-[#F0F2F5] min-h-screen text-[#1C1E21] overflow-x-hidden")}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
