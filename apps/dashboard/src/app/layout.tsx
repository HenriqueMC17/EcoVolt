import type { Metadata } from 'next';
import '../design-system/theme.css';

export const metadata: Metadata = {
  title: 'EcoVolt Enterprise',
  description: 'Centro de Comando AI para Operação Energética',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
