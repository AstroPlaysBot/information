import '../styles/globals.css';
import { ReactNode } from 'react';
import FixedHeader from '../components/FixedHeader';
import FixedFooter from '../components/FixedFooter';
import Background from '../components/Background';

export const metadata = {
  title: 'AstroPlays Discord Bot',
  description: 'Website für den Discord Bot AstroPlays',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className="min-h-screen">
      <body className="bg-neutral-950 flex flex-col min-h-screen text-white">
        {/* GLOBALER HINTERGRUND */}
        <Background />

        <FixedHeader />

        <main className="pt-28 px-6 flex-1">
          {children}
        </main>

        <FixedFooter />
      </body>
    </html>
  );
}
