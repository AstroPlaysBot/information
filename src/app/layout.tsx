import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import FixedHeader from '../components/FixedHeader';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <LanguageProvider>
          <FixedHeader />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
