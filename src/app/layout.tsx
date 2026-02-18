import '../styles/globals.css';
import { ReactNode } from 'react';
import FixedHeader from '../components/FixedHeader';
import FixedFooter from '../components/FixedFooter';

export const metadata = {
  title: 'AstroPlays Discord Bot',
  description: 'Website für den Discord Bot AstroPlays',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="relative min-h-screen flex flex-col text-white">
        {/* 🌌 GLOBALER CSS-HINTERGRUND */}
        <div className="bg-space pointer-events-none" />

        <FixedHeader />

        <main className="relative z-10 pt-28 px-6 flex-1">
          {children}
        </main>

        <div className="relative z-10">
          <FixedFooter />
        </div>
      </body>
    </html>
  );
}
