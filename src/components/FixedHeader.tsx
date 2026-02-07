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
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <LanguageProvider>
          <FixedHeader />

          {/* Main Content */}
          <main className="flex-grow pt-28 px-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-200 font-bold py-6 mt-8 w-full">
            <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-4">
              <span>© 2026 AstroPlaysBot</span>
              <div className="flex gap-4">
                <a href="/impressum" className="hover:text-white transition">Impressum</a>
                <a href="/datenschutz" className="hover:text-white transition">Datenschutz</a>
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
