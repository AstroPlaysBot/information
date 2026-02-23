'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminBoardWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin-check').then(async (res) => {
      const data = await res.json();
      if (!data.allowed) router.replace('/?error=admin');
    });
  }, []);

  return <>{children}</>;
}
