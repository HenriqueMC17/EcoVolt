import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/shared/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoVolt | Energia Renovável Sob Demanda para Eventos",
  description: "Plataforma de intermediação e gestão energética para eventos. Conectamos organizadores a provedores de energia limpa com previsibilidade e controle.",
  keywords: ["energia renovável", "eventos", "sustentabilidade", "gestão energética", "EcoVolt", "B2B SaaS"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} scroll-smooth dark`} suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
