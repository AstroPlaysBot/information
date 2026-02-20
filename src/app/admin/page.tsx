// app/admin/page.tsx
import { getApplications } from "../../lib/applications";
import Link from "next/link";

export default async function AdminInbox() {
  const applications = await getApplications(); // echte Bewerbungen aus DB/API

  if (!applications.length) {
    return <p className="text-gray-400">Keine Bewerbungen vorhanden.</p>;
  }

  return (
    <div className="space-y-6">
      {applications.map(app => (
        <Link
          key={app.id}
          href={`/admin/application/${app.id}`}
          className="block p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{app.name}</h3>
              <p className="text-gray-400 text-sm">
                Bewerbung als {app.role} · {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
