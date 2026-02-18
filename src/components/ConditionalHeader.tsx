'use client';
import { usePathname } from 'next/navigation';
import FixedHeader from './FixedHeader';

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Header nicht anzeigen, wenn wir auf /dashboard oder Unterseiten sind
  if (pathname.startsWith('/dashboard')) return null;

  return <FixedHeader />;
}
