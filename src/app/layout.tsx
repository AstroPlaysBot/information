'use client';
import '../styles/globals.css';
import { ReactNode } from 'react';
import FixedHeader from '../components/FixedHeader';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata = {
  title: 'AstroPlays Discord Bot',
  description: 'Website für den Discord Bot AstroPlays',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-gray-50">
        {/* Globaler Sprach-Provider */}
        <LanguageProvider>
          <FixedHeader />
          <main className="pt-28 px-6">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
