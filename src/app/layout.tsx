import './styles/globals.css';
import { ReactNode } from 'react';
import FixedHeader from '../components/FixedHeader';

export const metadata = {
  title: 'AstroPlays Discord Bot',
  description: 'Website für den Discord Bot AstroPlays',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <FixedHeader />
        <main className="pt-[140px] px-4">
          {children}
        </main>
      </body>
    </html>
  );
}

