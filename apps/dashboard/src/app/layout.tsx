import type { Metadata } from "next";
import { Providers } from "./providers";
import { DashboardLayout } from "@/shared/components/DashboardLayout";
import "../index.css";

export const metadata: Metadata = {
  title: "EcoVolt - Energy Nexus",
  description: "Luxury Enterprise Energy Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </Providers>
      </body>
    </html>
  );
}
