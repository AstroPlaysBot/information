// lib/applications.ts
export interface Application {
  id: string;
  name: string;
  role: string;
  createdAt: string;
  answers: string;
}

export async function getApplications(): Promise<Application[]> {
  // Hier deine echte DB-Query oder API Call
  // Beispiel: fetch von Supabase, Prisma oder eigener API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`);
  return await res.json();
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${id}`);
  if (!res.ok) return null;
  return await res.json();
}
