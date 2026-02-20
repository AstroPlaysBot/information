export interface Application {
  id: string;
  name: string;
  role: string;
  status: 'open' | 'claimed';
  claimedBy?: string;
  createdAt: string;
  age?: string;
  discord?: string;
  email?: string;
  reason?: string;
  answers?: string;
  content?: string;
}

export async function getApplications(): Promise<Application[]> {
  return []; // TODO: DB oder API anschließen
}

export async function getApplicationById(id: string): Promise<Application | null> {
  return null; // TODO: DB oder API anschließen
}
