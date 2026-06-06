import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";
import { Header } from "@/widgets/header/ui/Header";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoVolt – Operating System",
  description: "Executive operating system for energy optimization, forecasting and telemetry.",
};

import { CommandPalette } from "@/features/search/ui/CommandPalette";
import ConvexClientProvider from "@/shared/providers/ConvexClientProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname === "/login";

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
    >
      <body className="h-full flex bg-bg-main text-text-main overflow-hidden">
        <ConvexClientProvider>
          {!isLoginPage && <Sidebar />}
          <div className="flex-1 flex flex-col h-full relative overflow-x-hidden">
            {!isLoginPage && <Header />}
            <main className={`flex-1 overflow-y-auto ${isLoginPage ? "p-0" : "p-8"}`}>
              {children}
            </main>
          </div>
          {!isLoginPage && <CommandPalette />}
        </ConvexClientProvider>
      </body>
    </html>
  );
}

