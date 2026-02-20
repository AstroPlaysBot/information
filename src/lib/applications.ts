// src/lib/applications.ts
export interface Application {
  id: string;
  name: string;
  role: string;
  status: 'open' | 'claimed';
  claimedBy?: string;
  createdAt: string;
  content?: string;
}

// TODO: Ersetze mit echter DB/API
export async function getApplications(): Promise<Application[]> {
  return [];
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const apps = await getApplications();
  return apps.find(a => a.id === id) || null;
}
