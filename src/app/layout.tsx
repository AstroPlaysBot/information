import '../styles/globals.css';
import { ReactNode } from 'react';
import FixedHeader from '../components/FixedHeader';

export const metadata = {
  title: 'AstroPlays Discord Bot',
  description: 'Website für den Discord Bot AstroPlays',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-gray-50">
        {/* FixedHeader immer oben */}
        <FixedHeader />

        {/* main-Content: Padding top = Höhe des Headers (h-24) + etwas Abstand */}
        <main className="pt-28 px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
